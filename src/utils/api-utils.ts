import { ComboBoxItemType } from "../components/extensions/custom-combobox";
import { SearchResponse } from "../hooks/use-infinite-scroll";

type User = {
  id: string;
  name: string;
  email: string;
  vehicleModel: string;
};

export const searchUsers = async (
  searchTerm: string,
  page: number,
  pageSize: number
): Promise<SearchResponse<ComboBoxItemType>> => {
  try {
    const start = (page - 1) * pageSize;
    let paginatedQueryString = `_start=${encodeURIComponent(
      start
    )}&_limit=${encodeURIComponent(pageSize)}`;
    if (searchTerm) {
      paginatedQueryString += `&name_like=${encodeURIComponent(searchTerm)}`;
    }

    const [paginatedResponse, totalResponse] = await Promise.all([
      fetch(`/api/users?${paginatedQueryString}`),
      fetch(
        `/api/users?${
          searchTerm ? `name_like=${encodeURIComponent(searchTerm)}` : ""
        }`,
        {
          method: "HEAD",
        }
      ),
    ]);

    const paginatedData = await paginatedResponse.json();
    const totalItems = parseInt(
      totalResponse.headers.get("content-length") || "0",
      10
    );

    return {
      data: paginatedData,
      hasMore: start + pageSize < totalItems,
      total: totalItems,
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    return {
      data: [],
      hasMore: false,
      total: 0,
    };
  }
};

export const searchUserById = async (id: string): Promise<User | null> => {
  try {
    const response = await fetch(`/api/users/${encodeURIComponent(id)}`);
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    return null;
  }
};
