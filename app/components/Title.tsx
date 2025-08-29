const Title = ({ title }: { title: string }) => {
  return (
    <div className="flex items-center gap-4">
      <h1 className="text-5xl font-bold bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
        {title}
      </h1>
      <div className="h-[2px] w-64 bg-neutral-500"></div>
    </div>
  );
};

export default Title;
