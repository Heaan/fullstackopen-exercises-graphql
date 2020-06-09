import { useApolloClient } from '@apollo/client';

export const useCacheUpdate = (query) => {
  const client = useApolloClient();

  const updateCacheWith = (add, all, variables = {}) => {
    const includedIn = (set, obj) => set.map((b) => b.id).includes(obj.id);

    const dataInStore = client.readQuery({ query, variables });

    if (!includedIn(dataInStore[all], add)) {
      client.writeQuery({
        query,
        variables,
        data: { [all]: dataInStore[all].concat(add) },
      });
    }
  };

  return updateCacheWith;
};
