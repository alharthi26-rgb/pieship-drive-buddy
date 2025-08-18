// PIESHIP Driver Training Booking - Demo/Legacy Page
// Main booking flow is now at the root "/"

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Calendar, MapPin, Users } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pieship-yellow/20 to-background">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-pieship-yellow rounded-3xl flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl font-bold text-pieship-black">P</span>
          </div>
          <h1 className="text-4xl font-bold text-pieship-black mb-4">
            PIESHIP Driver Training
          </h1>
          <p className="text-xl text-pieship-gray max-w-2xl mx-auto">
            Professional driver training platform serving Riyadh, Jeddah, and Dammam.
            Book your training session with certified supervisors.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
          <Card className="pieship-card p-6 text-center">
            <Calendar className="w-12 h-12 text-pieship-yellow mx-auto mb-4" />
            <h3 className="font-semibold text-pieship-black mb-2">Easy Booking</h3>
            <p className="text-pieship-gray">
              Simple 3-step booking process with real-time availability
            </p>
          </Card>
          
          <Card className="pieship-card p-6 text-center">
            <MapPin className="w-12 h-12 text-pieship-yellow mx-auto mb-4" />
            <h3 className="font-semibold text-pieship-black mb-2">3 Cities</h3>
            <p className="text-pieship-gray">
              Training centers in Riyadh, Jeddah, and Dammam
            </p>
          </Card>
          
          <Card className="pieship-card p-6 text-center">
            <Users className="w-12 h-12 text-pieship-yellow mx-auto mb-4" />
            <h3 className="font-semibold text-pieship-black mb-2">Expert Supervisors</h3>
            <p className="text-pieship-gray">
              Certified training supervisors for personalized instruction
            </p>
          </Card>
        </div>

        <div className="text-center">
          <Button
            onClick={() => window.location.href = '/'}
            size="lg"
            className="h-14 px-8 pieship-gradient text-pieship-black font-semibold text-lg"
          >
            Start Booking Process
            <ArrowRight className="w-5 h-5 ml-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
