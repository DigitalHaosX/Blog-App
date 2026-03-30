import ArticleForm from "../components/ArticleForm";

export default function CreateArticle() {
  return (
    <main className="flex-1 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-3xl">
        <ArticleForm />
      </div>
    </main>
  );
}
