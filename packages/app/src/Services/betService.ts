// Fetch imports
import queryString from "query-string";

// Repositories imports
import UserRepository from "../Repositories/ebetRepository";

const postPaymentAsync = async (
  payload: { amount: number; currency: string; source: string },
  token: string
): Promise<ApiResponse | null> => {
  try {
    return await UserRepository.post(
      "payments/charge",
      queryString.stringify(payload),
      token
    );
  } catch (err) {
    return null;
  }
};

export default { postPaymentAsync };
