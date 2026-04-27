import API_PATHS from "~/constants/apiPaths";
import { AvailableProduct } from "~/models/Product";
import { useQuery, useQueryClient, useMutation } from "react-query";
import React from "react";
import {
  HttpError,
  httpDelete,
  httpGet,
  httpPostJson,
  httpPutJson,
} from "~/utils/http";

export function useAvailableProducts() {
  return useQuery<AvailableProduct[], HttpError>(
    "available-products",
    async () => httpGet<AvailableProduct[]>(`${API_PATHS.product}/products`),
  );
}

export function useInvalidateAvailableProducts() {
  const queryClient = useQueryClient();
  return React.useCallback(
    () => queryClient.invalidateQueries("available-products", { exact: true }),
    [],
  );
}

export function useAvailableProduct(id?: string) {
  return useQuery<AvailableProduct, HttpError>(
    ["product", { id }],
    async () =>
      httpGet<AvailableProduct>(`${API_PATHS.product}/products/${id}`),
    { enabled: !!id },
  );
}

export function useRemoveProductCache() {
  const queryClient = useQueryClient();
  return React.useCallback(
    (id?: string) =>
      queryClient.removeQueries(["product", { id }], { exact: true }),
    [],
  );
}

export function useUpsertAvailableProduct() {
  return useMutation((values: AvailableProduct) =>
    httpPutJson<AvailableProduct, AvailableProduct>(
      `${API_PATHS.bff}/product`,
      values,
      true,
    ),
  );
}

/** Creates a product via Product Service (DynamoDB). Body matches CDK POST /products. */
export function useCreateProductOnProductService() {
  return useMutation(
    (
      values: Pick<
        AvailableProduct,
        "title" | "description" | "price" | "count"
      >,
    ) =>
      httpPostJson<
        Pick<AvailableProduct, "title" | "description" | "price" | "count">,
        AvailableProduct
      >(`${API_PATHS.product}/products`, values, false),
  );
}

export function useDeleteAvailableProduct() {
  return useMutation((id: string) =>
    httpDelete(`${API_PATHS.bff}/product/${id}`, true),
  );
}
