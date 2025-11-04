'use server';

/**
 * @fileOverview Generates meta tags (title, description) for a page based on CMS data.
 *
 * - generateMetaTags - A function that generates meta tags.
 * - GenerateMetaTagsInput - The input type for the generateMetaTags function.
 * - GenerateMetaTagsOutput - The return type for the generateMetaTags function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMetaTagsInputSchema = z.object({
  content: z.string().describe('The main content of the page.'),
});
export type GenerateMetaTagsInput = z.infer<typeof GenerateMetaTagsInputSchema>;

const GenerateMetaTagsOutputSchema = z.object({
  title: z.string().describe('The generated title for the meta tag.'),
  description: z.string().describe('The generated description for the meta tag.'),
});
export type GenerateMetaTagsOutput = z.infer<typeof GenerateMetaTagsOutputSchema>;

export async function generateMetaTags(input: GenerateMetaTagsInput): Promise<GenerateMetaTagsOutput> {
  return generateMetaTagsFlow(input);
}

const generateMetaTagsPrompt = ai.definePrompt({
  name: 'generateMetaTagsPrompt',
  input: {schema: GenerateMetaTagsInputSchema},
  output: {schema: GenerateMetaTagsOutputSchema},
  prompt: `You are an SEO expert. Generate a title and description meta tag for the following content:

Content: {{{content}}}

Ensure the title is concise and engaging, and the description accurately summarizes the content while encouraging clicks from search engine results pages.`,
});

const generateMetaTagsFlow = ai.defineFlow(
  {
    name: 'generateMetaTagsFlow',
    inputSchema: GenerateMetaTagsInputSchema,
    outputSchema: GenerateMetaTagsOutputSchema,
  },
  async input => {
    const {output} = await generateMetaTagsPrompt(input);
    return output!;
  }
);
