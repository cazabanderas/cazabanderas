import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { getTeamResources, createTeamResource, deleteTeamResource, incrementDownloadCount } from "../db";
import { TRPCError } from "@trpc/server";
import { storagePut } from "../storage";
import type { TeamResource } from "../../drizzle/schema";

export const resourcesRouter = router({
  /**
   * Get all team resources with optional filtering
   */
  list: publicProcedure
    .input(
      z.object({
        category: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      try {
        const resources = await getTeamResources({
          category: input.category,
        });

        return resources.map((r: TeamResource) => ({
          id: r.id,
          title: r.title,
          description: r.description,
          category: r.category,
          fileUrl: r.fileUrl,
          fileName: r.fileName,
          fileSize: r.fileSize,
          mimeType: r.mimeType,
          downloadCount: r.downloadCount,
          tags: r.tags ? r.tags.split(",").map((t: string) => t.trim()) : [],
          createdAt: r.createdAt,
        }));
      } catch (error) {
        console.error("[Resources] Failed to list resources:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch resources",
        });
      }
    }),

  /**
   * Upload a new resource file
   */
  upload: publicProcedure
    .input(
      z.object({
        title: z.string().min(1, "Title is required"),
        description: z.string().optional(),
        category: z.string().min(1, "Category is required"),
        tags: z.array(z.string()).optional(),
        fileData: z.string(), // base64 encoded file
        fileName: z.string(),
        mimeType: z.string(),
        fileSize: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        // Decode base64 file
        const buffer = Buffer.from(input.fileData, "base64");

        // Upload to S3
        const fileKey = `resources/${Date.now()}-${input.fileName}`;
        const { url } = await storagePut(fileKey, buffer, input.mimeType);

        // Create database entry
        await createTeamResource({
          title: input.title,
          description: input.description || null,
          category: input.category,
          fileUrl: url,
          fileKey,
          fileName: input.fileName,
          fileSize: input.fileSize,
          mimeType: input.mimeType,
          uploadedBy: 1, // TODO: Get from auth context
          downloadCount: 0,
          isPublic: 0,
          tags: input.tags?.join(",") || null,
        });

        return {
          success: true,
          message: "Resource uploaded successfully",
        };
      } catch (error) {
        console.error("[Resources] Failed to upload resource:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to upload resource",
        });
      }
    }),

  /**
   * Download a resource and increment download count
   */
  download: publicProcedure
    .input(
      z.object({
        resourceId: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        await incrementDownloadCount(input.resourceId);

        return {
          success: true,
        };
      } catch (error) {
        console.error("[Resources] Failed to record download:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to record download",
        });
      }
    }),

  /**
   * Delete a resource
   */
  delete: publicProcedure
    .input(
      z.object({
        resourceId: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        await deleteTeamResource(input.resourceId);

        return {
          success: true,
          message: "Resource deleted successfully",
        };
      } catch (error) {
        console.error("[Resources] Failed to delete resource:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete resource",
        });
      }
    }),
});
