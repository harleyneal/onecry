import Image from "next/image";
import ParticleSymbol from "./components/ParticleSymbol";

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-teal-light">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="#" className="flex items-center gap-3">
          <Image
            src="/assets/logo-light.svg"
            alt="OneCry Pensacola"
            width={180}
            height={40}
            className="h-11 w-auto"
            priority
          />
        </a>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-teal-dark/70">
          <a href="#mission" className="hover:text-teal-dark transition-colors">
            Mission
          </a>
          <a
            href="#how-it-works"
            className="hover:text-teal-dark transition-colors"
          >
            The Vision
          </a>
          <a
            href="#why-we-pray"
            className="hover:text-teal-dark transition-colors"
          >
            Why We Pray
          </a>
          <a
            href="#blessings"
            className="hover:text-teal-dark transition-colors"
          >
            Blessings
          </a>
          <a
            href="#join"
            className="ml-2 px-5 py-2.5 bg-teal text-white rounded-full hover:bg-teal-medium transition-colors"
          >
            Join Us
          </a>
        </div>
        <a
          href="#join"
          className="md:hidden px-4 py-2 bg-teal text-white text-sm rounded-full hover:bg-teal-medium transition-colors"
        >
          Join Us
        </a>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-teal-light/60 via-white/80 to-teal-light/25" />

      <Image
        src="/assets/pensacola.webp"
        alt=""
        fill
        className="absolute inset-0 z-[1] object-cover object-top opacity-[0.25] pointer-events-none"
        priority
        aria-hidden="true"
      />

      <ParticleSymbol className="absolute inset-0 z-[2] w-full h-full opacity-[0.40] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <div className="mb-8">
          <Image
            src="/assets/symbol.svg"
            alt="OneCry flame"
            width={80}
            height={120}
            className="mx-auto h-32 w-auto mb-6"
          />
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-teal-dark mb-6 leading-[1.1]">
          One Body.
          <br />
          <span className="text-teal">One Cry.</span>
        </h1>
        <p className="text-xl md:text-2xl text-teal-dark/70 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
          Uniting churches across Pensacola for 24/7/365 prayer — so that at
          every hour, someone is interceding for our city and its people.
        </p>
        <div className="flex items-center justify-center">
          <a
            href="#join"
            className="px-8 py-4 bg-teal text-white text-lg font-medium rounded-full hover:bg-teal-medium transition-all hover:shadow-lg hover:shadow-teal/20"
          >
            Commit Your Church
          </a>
        </div>
      </div>
    </section>
  );
}

function Mission() {
  return (
    <section id="mission" className="py-20 md:py-28 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        <p className="text-teal font-semibold text-sm uppercase tracking-widest mb-4">
          Our Mission
        </p>
        <h2 className="text-3xl md:text-5xl font-bold text-teal-dark mb-8 leading-tight">
          Pensacola prayed for,
          <br />
          every hour of every day.
        </h2>
        <div className="space-y-6 text-lg text-teal-dark/70 leading-relaxed">
          <p>
            Our mission is to see Pensacola prayed for 24/7/365 — so that at all
            times throughout the year, someone will be praying for our city and
            its people.
          </p>
          <p>
            This will be accomplished by churches signing up and committing to
            cover one day a month for 24 hours of night and day prayer. If a
            congregation does not have enough people to cover 24 hours, we
            encourage connecting with a sister church so the two can cover a
            24-hour period together.
          </p>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "A Church Commits",
      description:
        "Your church signs up to cover one specific day each month with 24 hours of prayer.",
    },
    {
      number: "02",
      title: "24 People Sign Up",
      description:
        "Each church recruits 24 people who will each commit to pray for one hour on that day, every month for 12 months.",
    },
    {
      number: "03",
      title: "The Model Multiplies",
      description:
        "This model is multiplied throughout Escambia and Santa Rosa Counties until every day is covered in night and day prayer.",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-teal-light/50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold text-teal-dark leading-tight">
            The Vision
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-12 md:gap-8">
          {steps.map((step) => (
            <div key={step.number} className="text-center md:text-left">
              <span className="text-6xl font-bold text-teal/20 block mb-4">
                {step.number}
              </span>
              <h3 className="text-xl font-bold text-teal-dark mb-3">
                {step.title}
              </h3>
              <p className="text-teal-dark/70 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-16 text-center">
          <p className="text-teal-dark/60 text-lg italic max-w-2xl mx-auto">
            &ldquo;We can go faster alone, but we can go further
            together.&rdquo;
          </p>
        </div>
      </div>
    </section>
  );
}

function WhyWePray() {
  return (
    <section id="why-we-pray" className="py-20 md:py-28 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        <p className="text-teal font-semibold text-sm uppercase tracking-widest mb-4">
          Why We Pray
        </p>
        <h2 className="text-3xl md:text-5xl font-bold text-teal-dark mb-6 leading-tight">
          Seek the peace of the city.
        </h2>
        <blockquote className="border-l-4 border-teal pl-6 py-2 mb-12 text-xl text-teal-dark/70 italic leading-relaxed">
          &ldquo;...seek the peace of the city where I have caused you to live,
          and pray to the LORD for it; for in its peace you will have
          peace.&rdquo;
          <span className="block text-base mt-2 not-italic text-teal font-medium">
            Jeremiah 29:7
          </span>
        </blockquote>

        <div className="space-y-8 text-lg text-teal-dark/70 leading-relaxed">
          <p>
            What matters most is that we are praying toward the fulfillment of
            God&rsquo;s kingdom purpose and plans for the greater Pensacola
            area. We want to see ourselves as advocates for the people in
            Pensacola by taking a stand for them.
          </p>
          <p>
            We are all called to be &ldquo;watchmen on the wall&rdquo; and
            &ldquo;repairers of the breach.&rdquo; Let us stand strong on behalf
            of those the Church is called to intercede for.
          </p>
        </div>

        <div className="mt-16 grid md:grid-cols-2 gap-8">
          <div className="bg-teal-light/40 rounded-2xl p-8">
            <h3 className="text-lg font-bold text-teal-dark mb-3">
              Pray for people, not just problems
            </h3>
            <p className="text-teal-dark/70 leading-relaxed">
              When our focus is on circumstances to change, we overlook the
              immediate spiritual needs of the people themselves. Jesus is more
              concerned with our character and life purpose than just eliminating
              problems.
            </p>
          </div>
          <div className="bg-teal-light/40 rounded-2xl p-8">
            <h3 className="text-lg font-bold text-teal-dark mb-3">
              Be light, not just warriors
            </h3>
            <p className="text-teal-dark/70 leading-relaxed">
              We want to be Light to our city by praying and asking God to
              strengthen people in the face of the enemy. Jesus wants all to grow
              in faith and to live in a trusting, love relationship with His Son.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function BlessingIcon({ type }: { type: string }) {
  const cls = "w-10 h-10 text-teal";
  switch (type) {
    case "peace":
      // Classic dove of peace — bird in flight with olive branch
      return (
        <svg className={cls} viewBox="0 0 64 64" fill="currentColor">
          <path d="M58 8c-2-1-5.5-.5-8.5 1.5C46.5 11.5 44 15 43 18c-2-1-5-1.5-8-.5-3 1-5 3.5-6 6l-8.5-3c-.5-.2-1 0-1.2.4L16 28c-.3.5 0 1.1.5 1.3l8 3c-.5 2-.5 4 .2 6l-9 5.5c-.5.3-.6.8-.4 1.3l1.5 3c.2.5.8.7 1.3.5l9.5-4.5c1 1 2.2 1.8 3.4 2.4l-2 5c-.2.5 0 1 .4 1.3l3 1.5c.5.2 1.1 0 1.3-.5l2.5-5.5c1 .1 2 .1 3-.1l1 3c.1.4.5.7 1 .7h.2l3.2-.8c.5-.1.8-.6.7-1.1l-1.2-3.5c2.5-1.5 4.2-4 4.8-7l5.5-.5c.5 0 .9-.5.9-1v-3c0-.6-.4-1-.9-1.1l-5.5-.8c-.3-1.5-1-2.8-2-4l5-7c.3-.4.2-1-.2-1.3L49 16c1.5-3 3.5-5.5 6-6.5 1-.4.5-1.2-.5-1.5zM34 38c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6z" />
        </svg>
      );
    case "health":
      // Solid filled heart
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      );
    case "provision":
      // Open hands receiving — symbol of God's provision
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="currentColor">
          <path d="M2.5 16.5c0-1.5.7-2.9 1.8-3.8L7 10.5c.5-.4 1.2-.5 1.8-.2l2.2 1.2 2.2-1.2c.6-.3 1.3-.2 1.8.2l2.7 2.2c1.1.9 1.8 2.3 1.8 3.8V18c0 1.7-1.3 3-3 3H5.5c-1.7 0-3-1.3-3-3v-1.5z" />
          <path d="M12 3l-2.5 5h5L12 3z" />
          <circle cx="12" cy="10" r="1.5" />
        </svg>
      );
    case "transformation":
      // Solid sun/radiance
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0-5l-1 3h2l-1-3zm0 20l1-3h-2l1 3zM5.64 5.64l2.12 2.12 1.06-1.06-2.12-2.12-1.06 1.06zM17.3 17.3l-2.12-2.12-1.06 1.06 2.12 2.12 1.06-1.06zM2 12l3 1v-2l-3 1zm20 0l-3-1v2l3-1zM5.64 18.36l1.06-1.06-2.12-2.12-1.06 1.06 2.12 2.12zM18.36 5.64l-1.06 1.06 2.12 2.12 1.06-1.06-2.12-2.12z" />
        </svg>
      );
    default:
      return null;
  }
}

function Blessings() {
  const blessings = [
    {
      iconType: "peace",
      title: "Peace",
      description:
        "In our schools, in our homes, for those in authority to have wisdom and to lead with gentle authority \u2014 for Pensacola to become known as a city of Peace.",
    },
    {
      iconType: "health",
      title: "Prosperity & Health",
      description:
        "By renewing minds, protecting hearts, and for the souls of each man, woman, and child to be restored to God \u2014 for sturdy marriages and family fullness.",
    },
    {
      iconType: "provision",
      title: "Provision",
      description:
        "From God to provide for daily needs, protection from harm, ample jobs, and freedom from cycles of sin.",
    },
    {
      iconType: "transformation",
      title: "Transformation",
      description:
        "Of our entire community for God\u2019s glory \u2014 for strong and vibrant church communities flourishing with Kingdom purposes.",
    },
  ];

  return (
    <section id="blessings" className="py-20 md:py-28 bg-teal-light/50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-20">
          <p className="text-teal font-semibold text-sm uppercase tracking-widest mb-4">
            Prayers of Blessing
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-teal-dark leading-tight">
            What we pray for
          </h2>
          <p className="mt-6 text-lg text-teal-dark/70 max-w-2xl mx-auto leading-relaxed">
            Blessings are prayers of God&rsquo;s intended goodness, and
            blessings are always prayers of hope.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {blessings.map((b) => (
            <div
              key={b.title}
              className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="text-xl font-bold text-teal-dark mb-3">
                {b.title}
              </h3>
              <p className="text-teal-dark/70 leading-relaxed">
                {b.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function JoinCTA() {
  return (
    <section
      id="join"
      className="py-20 md:py-28 bg-teal-dark relative overflow-hidden"
    >
      <ParticleSymbol className="absolute inset-0 w-full h-full opacity-[0.15] pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
          Will your church answer the cry?
        </h2>
        <p className="text-xl text-white/70 mb-10 leading-relaxed max-w-xl mx-auto">
          Commit to one day a month. 24 people, each praying one hour. Together,
          we can cover Pensacola in prayer every single day of the year.
        </p>
        <a
          href="mailto:onecrypensacola@gmail.com?subject=Our%20Church%20Wants%20to%20Join%20OneCry"
          className="inline-block px-8 py-4 bg-teal text-white text-lg font-medium rounded-full hover:bg-teal-medium transition-all hover:shadow-lg hover:shadow-teal/30"
        >
          Get In Touch
        </a>
        <p className="mt-6 text-white/50 text-sm">
          Or contact Stephanie Tucker at New Testament Fellowship
        </p>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-12 bg-teal-dark border-t border-white/10">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Image
            src="/assets/logo-dark.svg"
            alt="OneCry Pensacola"
            width={140}
            height={32}
            className="h-7 w-auto opacity-80"
          />
          <div className="flex items-center gap-8 text-sm text-white/50">
            <a
              href="#mission"
              className="hover:text-white/80 transition-colors"
            >
              Mission
            </a>
            <a
              href="#how-it-works"
              className="hover:text-white/80 transition-colors"
            >
              The Vision
            </a>
            <a
              href="#why-we-pray"
              className="hover:text-white/80 transition-colors"
            >
              Why We Pray
            </a>
            <a
              href="#blessings"
              className="hover:text-white/80 transition-colors"
            >
              Blessings
            </a>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-white/10 text-center text-sm text-white/30">
          <p>
            For God&rsquo;s glory to be revealed. &mdash; OneCry Pensacola
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Mission />
      <HowItWorks />
      <WhyWePray />
      <Blessings />
      <JoinCTA />
      <Footer />
    </main>
  );
}
