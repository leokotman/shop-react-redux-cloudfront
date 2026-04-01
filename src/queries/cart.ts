import React from "react";
import { useQuery, useQueryClient, useMutation } from "react-query";
import API_PATHS from "~/constants/apiPaths";
import { CartItem } from "~/models/CartItem";
import { HttpError, httpGetAuthorized, httpPutJson } from "~/utils/http";

export function useCart() {
  return useQuery<CartItem[], HttpError>("cart", async () =>
    httpGetAuthorized<CartItem[]>(`${API_PATHS.cart}/profile/cart`)
  );
}

export function useCartData() {
  const queryClient = useQueryClient();
  return queryClient.getQueryData<CartItem[]>("cart");
}

export function useInvalidateCart() {
  const queryClient = useQueryClient();
  return React.useCallback(
    () => queryClient.invalidateQueries("cart", { exact: true }),
    []
  );
}

export function useUpsertCart() {
  return useMutation((values: CartItem) =>
    httpPutJson<CartItem, CartItem[]>(
      `${API_PATHS.cart}/profile/cart`,
      values,
      true
    )
  );
}
