import { getServerSession } from "next-auth";
import Image from "next/image";
import { nextAuthOptions } from "../lib/next.auth/option";
import { BookType, Purchase, User } from "../types/types";
import { getBookById } from "../lib/microcms/client";
import PurchaseDetailBook from "../components/PurchaseDetailBook";

export default async function ProfilePage() {
  const session = await getServerSession(nextAuthOptions);
  const user = session?.user as User;
  let purchasedBooks: BookType[] = [];
  if (user) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_SERVER}/purchases/${user.id}`,
      { cache: "no-store" }
    );
    const purchaseData = await response.json();

    purchasedBooks = await Promise.all<BookType[]>(
      purchaseData
        .map((purchase: Purchase) => purchase.bookId)
        .map(async (bookId: string) => {
          return await getBookById(bookId);
        })
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">プロフィール</h1>

      <div className="bg-white shadow-md rounded p-4">
        <div className="flex items-center">
          <Image
            priority
            src={user.image || "/default_icon.png"}
            alt="user profile_icon"
            width={60}
            height={60}
            className="rounded-t-md"
          />
          <h2 className="text-lg ml-4 font-semibold">お名前：{user.name}</h2>
        </div>
      </div>

      <span className="font-medium text-lg mb-4 mt-4 block">購入した記事</span>
      <div className="flex items-center gap-6">
        {purchasedBooks?.map((book: BookType) => {
          return (
            <>
              <div key={book.id}>
                <PurchaseDetailBook book={book}></PurchaseDetailBook>
              </div>
            </>
          );
        })}
      </div>
    </div>
  );
}
