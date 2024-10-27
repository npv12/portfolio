import Navbar from "@/app/components/Navbar";
import fs from "fs";
import matter from "gray-matter";
import md from "markdown-it";

export default async function Page({ params }: { params: { id: string } }) {
  try {
    const fileName = fs.readFileSync(`content/blogs/${params.id}.md`, "utf-8");
    const { data, content } = matter(fileName);

    return (
      <div>
        <Navbar />
        <div className="mt-2 p-4 flex gap-8">
          <div className="flex-grow">
            <div
              className="prose mx-auto lg:prose-lg"
              dangerouslySetInnerHTML={{ __html: md().render(content) }}
            />
          </div>
          <div className="w-96 sticky top-24 h-fit bg-white rounded-lg shadow-lg p-6 ml-auto hidden md:block z-[-1]">
            <h3 className="text-xl font-semibold mb-4">Post Details</h3>
            {data.date && (
              <div className="mb-3">
                <span className="font-medium">Published:</span>{" "}
                {new Date(data.date).toLocaleDateString()}
              </div>
            )}
            {data.author && (
              <div className="mb-3">
                <span className="font-medium">Author:</span> {data.author}
              </div>
            )}
            {data.tags && (
              <div className="mb-3">
                <span className="font-medium">Tags:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {data.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-100 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    return <div>Error loading post</div>;
  }
}
