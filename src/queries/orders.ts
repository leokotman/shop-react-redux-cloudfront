import React from "react";
import { useQuery, useQueryClient, useMutation } from "react-query";
import API_PATHS from "~/constants/apiPaths";
import { OrderStatus } from "~/constants/order";
import { Order } from "~/models/Order";
import { HttpError, httpDelete, httpGet, httpPutJson } from "~/utils/http";

export function useOrders() {
  return useQuery<Order[], HttpError>("orders", async () =>
    httpGet<Order[]>(`${API_PATHS.order}/order`)
  );
}

export function useInvalidateOrders() {
  const queryClient = useQueryClient();
  return React.useCallback(
    () => queryClient.invalidateQueries("orders", { exact: true }),
    []
  );
}

export function useUpdateOrderStatus() {
  return useMutation(
    (values: { id: string; status: OrderStatus; comment: string }) => {
      const { id, ...data } = values;
      return httpPutJson(`${API_PATHS.order}/order/${id}/status`, data, true);
    }
  );
}

export function useSubmitOrder() {
  return useMutation((values: Omit<Order, "id">) =>
    httpPutJson<Omit<Order, "id">>(`${API_PATHS.order}/order`, values, true)
  );
}

export function useInvalidateOrder() {
  const queryClient = useQueryClient();
  return React.useCallback(
    (id: string) =>
      queryClient.invalidateQueries(["order", { id }], { exact: true }),
    []
  );
}

export function useDeleteOrder() {
  return useMutation((id: string) =>
    httpDelete(`${API_PATHS.order}/order/${id}`, true)
  );
}
