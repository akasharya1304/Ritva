import { GiSparkles } from "react-icons/gi";


interface HeaderProps {
  title: string;
  subtitle?: string;
}

const Header = ({ title, subtitle }: HeaderProps) => {
  return (
    <header className="pt-8 pb-6 px-4 text-center lotus-pattern">
      <div className="flex items-center justify-center gap-2 mb-2">
        <GiSparkles className="w-5 h-5 text-gold animate-breathe" />
        <h1 className="font-display text-3xl text-gradient-saffron">{title}</h1>
        <GiSparkles className="w-5 h-5 text-gold animate-breathe" />
      </div>
      {subtitle && (
        <p className="font-serif text-muted-foreground italic text-lg">{subtitle}</p>
      )}
      <div className="ornament-line w-32 mx-auto mt-4" />
    </header>
  );
};

export default Header;