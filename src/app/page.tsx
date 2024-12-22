import Link from "next/link";
import features from "../../features.json";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Questions from "@/components/qustions";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="flex justify-center flex-col items-center mx-auto py-32">
        <h1 className="text-6xl sm:text-7xl lg:text-8xl font-extrabold pb-6 tracking-tight bg-gradient-to-br from-gray-700 via-blue-100 to-gray-400 bg-clip-text text-transparent">
          Simplify Your Workflow
        </h1>
        <p className="text-5xl tracking-tighter font-semibold bg-gradient-to-br from-gray-700 via-blue-100 to-gray-400 bg-clip-text text-transparent">
          Strive: Uniting teams to reach their full potential and success
        </p>
        <div className="flex mt-8">
          <Button asChild size={"lg"} className="mr-4 font-semibold">
            <Link href="/onboarding">
              Get Started <ChevronRight />
            </Link>
          </Button>

          <Button
            asChild
            size={"lg"}
            variant="outline"
            className="mr-4 font-semibold"
          >
            <Link href="#features">
              Learn More <ChevronRight />
            </Link>
          </Button>
        </div>
      </section>

      <section id="features" className="py-10 px-10">
        <div className="flex flex-col justify-center items-center gap-4">
          <h2 className="text-6xl font-semibold bg-gradient-to-br from-gray-700 via-blue-100 to-gray-400 bg-clip-text text-transparent">
            Key Features
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-3">
            {features.map((feature, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-2xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="company" className="py-10 px-10">
        <div className="container mx-auto ">
          <div className="text-center">
            <h2 className="text-6xl font-semibold bg-gradient-to-br from-gray-700 via-blue-100 to-gray-400 bg-clip-text text-transparent py-4">
              Frequently asked questions
            </h2>
          </div>
          <Questions />
        </div>
      </section>

      <section id="start" className="py-10 px-10">
        <div className="container mx-auto ">
          <div className="text-center">
            <h2 className="text-6xl font-semibold bg-gradient-to-br from-gray-700 via-blue-100 to-gray-400 bg-clip-text text-transparent py-4">
              Ready to transfrom your workflow
            </h2>
            <h3 className="text-4xl font-semibold bg-gradient-to-br from-gray-500 via-blue-100 to-gray-400 bg-clip-text text-transparent mb-3">
              Join thousands of teams already using Strive to collaborate,
              organize, and achieve their goals seamlessly. Be part of the
              movement driving productivity and success!
            </h3>
            <Button
              asChild
              size={"lg"}
              className="font-semibold my-3 animate-bounce"
            >
              <Link href={"/onboarding"}>
                Join for Free <ChevronRight />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
