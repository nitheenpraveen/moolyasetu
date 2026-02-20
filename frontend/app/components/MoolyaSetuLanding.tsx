import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, ShieldCheck, Smile, Wallet } from "lucide-react";

export default function MoolyaSetuLanding() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 text-gray-900">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-12 items-center">
       <motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
           transition={{ duration: 0.6 }}
>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Shop with confidence. <br /> Feel good about every purchase.
          </h1>
          <p className="mt-6 text-lg text-gray-600">
            MoolyaSetu is like a smart friend who helps you choose the right
            product. We remove confusion, avoid bad purchases, and help you
            spend your money wisely.
          </p>

          <div className="mt-8 flex gap-4">
            <Button size="lg" className="rounded-2xl">
              Find the best product
            </Button>
            <Button size="lg" variant="outline" className="rounded-2xl">
              How we help you
            </Button>
          </div>

          <div className="mt-10 text-sm text-gray-500">
            Built for smart budget shoppers who care about value and trust.
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="relative"
        >
          <div className="bg-white shadow-xl rounded-2xl p-6 border">
            <div className="text-sm text-gray-500">Our top recommendation</div>
            <h3 className="text-xl font-semibold mt-2">
              Reliable Everyday Smartwatch
            </h3>
            <p className="text-gray-600 mt-2">
              We picked this because users stay happy long-term, the price is
              stable, and returns are very low.
            </p>

            <div className="mt-4 flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">₹7,499</div>
                <div className="text-sm text-green-600">
                  Best value for your budget
                </div>
              </div>
              <Button className="rounded-xl">See why</Button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Emotional Value Section */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold">
              We help you avoid regret
            </h2>
            <p className="mt-4 text-gray-600">
              Most people waste time comparing and still choose the wrong
              product. We make sure you feel confident before and after every
              purchase.
            </p>
          </div>

          <div className="mt-12 grid md:grid-cols-4 gap-6">
            {[
              {
                icon: <Heart className="w-6 h-6" />,
                title: "Peace of mind",
                desc: "Know you made the right choice every time.",
              },
              {
                icon: <ShieldCheck className="w-6 h-6" />,
                title: "Trust first",
                desc: "We care about long-term happiness, not hype.",
              },
              {
                icon: <Wallet className="w-6 h-6" />,
                title: "Smart savings",
                desc: "Spend less and still get the best quality.",
              },
              {
                icon: <Smile className="w-6 h-6" />,
                title: "Simple decisions",
                desc: "No stress. No confusion. Just clarity.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="rounded-2xl shadow-sm hover:shadow-md transition">
                  <CardContent className="p-6">
                    <div className="text-primary">{item.icon}</div>
                    <h3 className="font-semibold mt-4">{item.title}</h3>
                    <p className="text-sm text-gray-600 mt-2">
                      {item.desc}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold">
            People like you already trust MoolyaSetu
          </h2>
          <p className="mt-4 text-gray-600">
            Smart budget shoppers save time, avoid mistakes, and feel more
            confident.
          </p>

          <div className="mt-10 grid md:grid-cols-3 gap-6">
            {[
              "I stopped wasting hours comparing products.",
              "Feels like a friend who always gives the right advice.",
              "I save money and avoid bad purchases now.",
            ].map((quote, i) => (
              <Card key={i} className="rounded-2xl">
                <CardContent className="p-6 text-gray-700">
                  {quote}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-900 text-white py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold">
            Start making smarter decisions today
          </h2>
          <p className="mt-4 text-gray-300">
            Join early and let MoolyaSetu guide your next purchase.
          </p>
          <Button size="lg" className="mt-8 rounded-2xl">
            Get early access
          </Button>
        </div>
      </section>
    </div>
  );
}
