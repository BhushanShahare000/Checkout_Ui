import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

export const getClient = () => {
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const host = process.env.VERCEL_URL || 'localhost:3000';
    const uri = `${protocol}://${host}/api/graphql`;

    return new ApolloClient({
        cache: new InMemoryCache(),
        link: new HttpLink({
            uri,
            fetchOptions: { cache: 'no-store' },
        }),
    });
};
