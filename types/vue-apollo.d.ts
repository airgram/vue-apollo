import Vue, { PluginObject, PluginFunction } from 'vue';
import { ApolloQueryResult, ObservableQuery, SubscriptionOptions } from 'apollo-client'
import { Observable } from 'apollo-client/util/Observable';
import { ApolloProvider, VueApolloComponent } from './apollo-provider'
import {
  VueApolloQueryOptions,
  VueApolloMutationOptions,
  VueApolloSubscriptionOptions,
  VueApolloWatchQueryOptions
} from './options'

export class VueApollo extends ApolloProvider implements PluginObject<{}>{
  [key: string]: any;
  install: PluginFunction<{}>;

  static install(pVue: typeof Vue, options?:{} | undefined): void;
}

interface SmartApollo<V> {
  skip: boolean;
  refresh(): void;
  start(): void;
  stop(): void;
}

export interface SmartQuery<V> extends SmartApollo<V> {
  loading: boolean;
  fetchMore: ObservableQuery<any>['fetchMore'];
  subscribeToMore: ObservableQuery<any>['subscribeToMore'];
  refetch: ObservableQuery<any>['refetch'];
  setVariables: ObservableQuery<any>['setVariables'];
  setOptions: ObservableQuery<any>['setOptions'];
  startPolling: ObservableQuery<any>['startPolling'];
  stopPolling: ObservableQuery<any>['stopPolling'];
}

export interface SmartSubscription<V> extends SmartApollo<V> {
}

export interface DollarApollo<V> {
  vm: V;
  queries: Record<string, SmartQuery<V>>;
  subscriptions: Record<string, SmartSubscription<V>>;
  readonly provider: ApolloProvider;
  readonly loading: boolean;

  // writeonly not yet implemented in TypeScript: https://github.com/Microsoft/TypeScript/issues/21759
  /* writeonly */ skipAllQueries: boolean;
  /* writeonly */ skipAllSubscriptions: boolean;
  /* writeonly */ skipAll: boolean;

  query<R=any>(options: VueApolloQueryOptions<V, R>): Promise<ApolloQueryResult<R>>;
  mutate<R=any>(options: VueApolloMutationOptions<V, R>): Promise<ApolloQueryResult<R>>;
  subscribe<R=any>(options: SubscriptionOptions<R>): Observable<R>;

  addSmartQuery<R=any>(key: string, options: VueApolloWatchQueryOptions<V, R>): SmartQuery<V>;
  addSmartSubscription<R=any>(key: string, options: VueApolloSubscriptionOptions<V, R>): SmartSubscription<V>;
}

export function willPrefetch (component: VueApolloComponent, contextCallback?: boolean): VueApolloComponent
