const Title = ({ title }: { title: string }) => {
  return (
    <div className="flex items-center gap-4">
      <h1 className="text-5xl font-bold bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
        {title}
      </h1>
      <div className="hidden sm:block h-[2px] flex-1 max-w-64 bg-neutral-500" />
    </div>
  );
};

export default Title;
