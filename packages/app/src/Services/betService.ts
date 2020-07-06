// Fetch imports
import queryString from "query-string";

// Repositories imports
import UserRepository from "../Repositories/ebetRepository";

const postPaymentAsync = async (
  payload: { amount: number; source: string },
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

const getUpcomingMatchs = async (
  token: string
): Promise<IMatchServiceResponse | null> => {
  try {
    return await UserRepository.get(
      "bet/get/upcoming",
      null,
      token
    );
  } catch (err) {
    return null;
  }
}

const postMatch = async (
  token: string,
  payload: { idMatch: number, amount: number, idTeamBet: number, uuidUser: string }
) => {
  try {
    return await UserRepository.post(
      `bet/create/${payload.uuidUser}`,
      queryString.stringify(payload),
      token
    );
  } catch (error) {
    return null;
  }
}

const getMyBets = async (
  token: string,
  payload: { uuidUser: string }
) => {
  try {
    console.log("getMyBets --- payload:", payload, "token:", token);
    return await UserRepository.get(
      `bet/get/user/${payload.uuidUser}`, 
      null, 
      token 
    );
  } catch (error) {
    console.log(error);
    return null
  }
}

export default { postPaymentAsync, getUpcomingMatchs, postMatch, getMyBets };
