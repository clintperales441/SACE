const teamMembers = [
  {
    name: "Clint Perales",
    role: "Lead Developer",
    image: "ClintPeralesPicture.jpg",
  },
  {
    name: "Yusuf Oswa",
    role: "Lead AI Engineer",
    image: "YusufOswaPicture.jpg",
  },
  {
    name: "Japeth Luke Fuentes",
    role: "Developer",
    image: "JapethFuentesPicture.jpg",
  },
  {
    name: "Nicolo Francis Gabiana",
    role: "Developer",
    image: "NicoloGabianaPicture.jpg",
  },
  {
    name: "Dante Ygot",
    role: "Developer",
    image: "DanteYgotPicture.jpg",
  },
];

const TeamSection = () => {
  return (
    <section className="section-padding bg-muted/30">
      <div className="container-main">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Meet the Team
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Passionate individuals dedicated to revolutionizing requirements engineering
          </p>
        </div>

        {/* Team grid */}
        <div className="flex flex-wrap justify-center gap-8 md:gap-12">
          {teamMembers.map((member, index) => (
            <div
              key={member.name}
              className="flex flex-col items-center group hover-scale animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative mb-4">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden ring-4 ring-card shadow-lg group-hover:ring-primary/30 group-hover:shadow-xl transition-all duration-300">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute inset-0 rounded-full bg-primary/0 group-hover:bg-primary/10 transition-all duration-300" />
              </div>
              
              <h3 className="font-display font-semibold text-lg text-foreground text-center">
                {member.name}
              </h3>
              <p className="text-muted-foreground text-sm text-center">
                {member.role}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
