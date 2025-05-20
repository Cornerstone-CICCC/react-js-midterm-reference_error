import { ProductList } from "@/components/shared/ProductList";
import { demoProducts } from "@/data/demoProducts";
import type { Product } from "@/types/Product";
import { getTransactionHistory } from "@/usecases/transactionHistories";
import { useEffect, useState } from "react";
import { ProfileDisplay } from "./ProfileDisplay";
import { ProfileEditForm } from "./ProfileEditForm";

type TabType = "purchase" | "sales";

interface UserProfile {
  email: string;
  nickname: string;
  avatarUrl: string;
  bio: string;
}

export function ProfilePage() {
  const [activeTab, setActiveTab] = useState<TabType>("purchase");
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    email: "user@example.com", // TODO: Fetch from API
    nickname: "Username",
    avatarUrl: "/assets/images/default-avatar.jpg",
    bio: "Please enter your bio.",
  });
  const [, setTransactionHistory] = useState<Product[]>([]);

  useEffect(() => {
    const fetchTransactionHistory = async () => {
      getTransactionHistory()
        .then((result) => {
          console.error("Transaction history:", result);
          if (result?.success && result.transactionHistories) {
            setTransactionHistory(result.transactionHistories);
          }
        })
        .catch((error) => {
          console.error("Error fetching transaction history:", error);
        });
    };
    fetchTransactionHistory();
  }, []);

  // TODO: Fetch products from API
  const purchaseProducts: Product[] = demoProducts.filter(
    (product) => product.status === "reserved",
  );
  const salesProducts: Product[] = demoProducts.filter((product) => product.status === "sold");

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleSaveProfile = (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
    setIsEditing(false);
    // TODO: Update profile via API
  };

  return (
    <div className="max-w-3xl mx-auto px-4 flex flex-col">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        {isEditing ? (
          <ProfileEditForm
            profile={profile}
            onSave={handleSaveProfile}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <ProfileDisplay profile={profile} onEdit={handleEditProfile} />
        )}

        {/* History Section */}
        <section className="bg-gray-50 rounded-lg overflow-hidden">
          <div className="bg-gray-100">
            <nav className="flex">
              <button
                className={`flex-1 px-4 py-3 text-sm sm:text-base font-medium text-center transition-colors ${
                  activeTab === "purchase"
                    ? "bg-gray-50 text-orange-600"
                    : "bg-gray-200 text-gray-600"
                }`}
                onClick={() => setActiveTab("purchase")}
              >
                Purchase History
              </button>
              <button
                className={`flex-1 px-4 py-3 text-sm sm:text-base font-medium text-center transition-colors ${
                  activeTab === "sales" ? "bg-gray-50 text-orange-600" : "bg-gray-200 text-gray-600"
                }`}
                onClick={() => setActiveTab("sales")}
              >
                Sales History
              </button>
            </nav>
          </div>

          <div className="p-4 sm:p-6">
            {activeTab === "purchase" ? (
              <ProductList products={purchaseProducts} emptyMessage="No purchase history" />
            ) : (
              <ProductList products={salesProducts} emptyMessage="No sales history" />
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
