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

    let countQuery = "";
    if (searchTerm) {
      countQuery = `?name_like=${encodeURIComponent(searchTerm)}`;
    }

    const [paginatedResponse, fullResponse] = await Promise.all([
      fetch(`http://localhost:4000/users?${paginatedQueryString}`),
      fetch(`http://localhost:4000/users?${countQuery}`),
    ]);
    const paginatedData = await paginatedResponse.json().then((s) =>
      s.map((s: User) => ({
        label: s.name,
        value: s.id,
      }))
    );

    const totalItems = await fullResponse.json().then((s) => s.length);

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

export const searchUserById = async (id: string): Promise<User> => {
  try {
    const data = await fetch(
      `http://localhost:4000/users/${encodeURIComponent(id)}`
    ).then((s) => s.json());

    return data;
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    return null;
  }
};
