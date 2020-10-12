import withApollo from 'next-with-apollo'
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'


export default withApollo(
  ({ initialState }) => new ApolloClient({
    uri: 'http://localhost:3000/graphql',
    cache: new InMemoryCache().restore(initialState || {}),
  }),
  {
    render: ({ Page, props }) => (
      <ApolloProvider client={props.apollo}>
        <Page {...props} />
      </ApolloProvider>
    ),
  },
)