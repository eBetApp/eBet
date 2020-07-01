// Fetch imports
import queryString from "query-string";

// Repositories imports
import Repository from "../Repositories/ebetRepository";

const postPaymentAsync = async (
  payload: { amount: number; source: string },
  token: string
): Promise<ApiResponse | null> => {
  try {
    return await Repository.post(
      "payments/charge",
      queryString.stringify(payload),
      token
    );
  } catch (err) {
    return null;
  }
};

const getBalanceAsync = async (
  payload: { accountId: string },
  token: string
): Promise<ApiResponse | null> => {
  try {
    return await Repository.post(
      "payments/account-balance",
      queryString.stringify(payload),
      token
    );
  } catch (err) {
    return null;
  }
};

const postNewAccountAsync = async (
  payload: { uuid: string; code: string },
  token: string
): Promise<ApiResponse | null> => {
  try {
    return await Repository.post(
      "payments/set-account",
      queryString.stringify(payload),
      token
    );
  } catch (err) {
    return null;
  }
};

export default { postPaymentAsync, getBalanceAsync, postNewAccountAsync };
