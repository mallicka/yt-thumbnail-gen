"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, Sparkles, Wand2 } from "lucide-react";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  prompt: z.string().min(5, {
    message: "Prompt must be at least 5 characters.",
  }).max(500),
  style: z.string(),
  refine: z.boolean(),
});

export function GeneratorForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
      style: "realistic",
      refine: false,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      const response = await fetch("/api/generate", {
        method: "POST",
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Failed to generate thumbnail");
      }

      toast.success("Thumbnail generated successfully!");
      form.reset({
        ...form.getValues(),
        prompt: "",
      });
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="bg-card border rounded-xl p-6 shadow-sm sticky top-24">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="prompt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Video Topic / Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="e.g., A futuristic gaming setup with neon lights..."
                    className="min-h-[100px] resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="style"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Visual Style</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a style" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="realistic">Realistic</SelectItem>
                      <SelectItem value="gaming">Gaming</SelectItem>
                      <SelectItem value="anime">Anime</SelectItem>
                      <SelectItem value="cyberpunk">Cyberpunk</SelectItem>
                      <SelectItem value="minimal">Minimalist</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="refine"
              render={({ field }) => (
                <FormItem className="flex flex-col justify-end space-y-2">
                  <FormLabel>AI Refine</FormLabel>
                  <FormControl>
                    <div className="flex items-center h-10 space-x-2">
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <span className="text-xs text-muted-foreground">Better prompts</span>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" className="w-full h-12 gap-2" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                {form.getValues("refine") ? "Refining & Generating..." : "Generating..."}
              </>
            ) : (
              <>
                {form.getValues("refine") ? <Wand2 className="h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
                Generate Thumbnail
              </>
            )}
          </Button>
          
          <div className="p-3 bg-muted/50 rounded-lg text-[10px] text-muted-foreground flex gap-2">
            <Sparkles className="h-3 w-3 shrink-0" />
            <span>Tip: AI Refine uses GPT-4o-mini to turn your basic idea into a professional image prompt automatically.</span>
          </div>
        </form>
      </Form>
    </div>
  );
}
