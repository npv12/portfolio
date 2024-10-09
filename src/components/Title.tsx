const Title = ({ title }: { title: string }) => {
  return (
    <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
      {title}
    </h1>
  );
};

export default Title;
