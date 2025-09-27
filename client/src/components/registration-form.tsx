import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Gamepad, ArrowRight } from "lucide-react";
import { calculateZodiac } from "@/lib/zodiac";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { type Player } from "@shared/schema";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  instagram: z.string().min(1, "Instagram handle is required").regex(/^[a-zA-Z0-9._]+$/, "Invalid Instagram handle"),
  birthdate: z.string().min(1, "Birthdate is required"),
});

interface RegistrationFormProps {
  onPlayerRegistered: (player: Player) => void;
}

export default function RegistrationForm({ onPlayerRegistered }: RegistrationFormProps) {
  const [zodiac, setZodiac] = useState<{ name: string; symbol: string } | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      instagram: "",
      birthdate: "",
    },
  });

  const createPlayerMutation = useMutation({
    mutationFn: async (data: { name: string; instagram: string; birthdate: string; zodiacSign: string }) => {
      const res = await apiRequest("POST", "/api/players", data);
      return res.json();
    },
    onSuccess: (player: Player) => {
      onPlayerRegistered(player);
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to register player",
      });
    },
  });

  const handleBirthdateChange = (birthdate: string) => {
    if (birthdate) {
      const zodiacSign = calculateZodiac(birthdate);
      setZodiac(zodiacSign);
    } else {
      setZodiac(null);
    }
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!zodiac) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a valid birthdate",
      });
      return;
    }

    const zodiacString = `${zodiac.symbol} ${zodiac.name}`;
    createPlayerMutation.mutate({
      ...values,
      zodiacSign: zodiacString,
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-border shadow-2xl">
        <CardContent className="pt-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full mx-auto mb-4 flex items-center justify-center">
              <Gamepad className="h-8 w-8 text-primary-foreground" data-testid="gamepad-icon" />
            </div>
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Match & Win
            </h1>
            <p className="text-muted-foreground">Enter your details to start playing</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter your name" 
                        data-testid="input-name"
                        className="bg-input border-border focus:ring-ring" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="instagram"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instagram Handle</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                          @
                        </span>
                        <Input 
                          placeholder="username" 
                          data-testid="input-instagram"
                          className="pl-8 bg-input border-border focus:ring-ring" 
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="birthdate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth</FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
                        data-testid="input-birthdate"
                        className="bg-input border-border focus:ring-ring" 
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          handleBirthdateChange(e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {zodiac && (
                <div className="bg-muted rounded-lg p-4 text-center" data-testid="zodiac-display">
                  <div className="zodiac-icon mb-2 text-4xl">{zodiac.symbol}</div>
                  <p className="text-sm">
                    Your zodiac sign: <span className="font-semibold text-accent">{zodiac.name}</span>
                  </p>
                </div>
              )}

              <Button 
                type="submit" 
                data-testid="button-start-game"
                className="w-full bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:opacity-90 transition-all transform hover:scale-105"
                disabled={createPlayerMutation.isPending}
              >
                {createPlayerMutation.isPending ? "Starting..." : "Start Playing"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
