import { z } from "zod";

export const FiltersSchema = z.object({
  dateRange: z
    .object({
      startDate: z
        .string()
        .describe("Start date for the search in YYYY-MM-DD format."),
      endDate: z
        .string()
        .describe("End date for the search in YYYY-MM-DD format."),
    })
    .optional()
    .describe("Filter results by a range of dates."),
  location: z
    .string()
    .describe(
      "The location where the user wants to search for events. Example: City, Country, or Region."
    ),
  budget: z
    .object({
      min: z.number().nonnegative().describe("Minimum budget for the search."),
      max: z
        .number()
        .positive()
        .optional()
        .describe("Maximum budget for the search."),
    })
    .describe("Specify the budget range for events."),
  favoriteTeams: z
    .array(z.string())
    .describe("List of favorite teams that the user is interested in."),
});
