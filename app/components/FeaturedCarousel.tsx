import { Form } from "@remix-run/react";
import Carousel from "./Carousel";
import { useQuery } from "@apollo/client/react/hooks/useQuery";
import { gql } from "@apollo/client/core";
import LottieCard from "./LottieCard";

const GET_FEATURED_ANIMATIONS = gql`
  query FeaturedPublicAnimations($first: Int, $after: String) {
    featuredPublicAnimations(first: $first, after: $after) {
      edges {
        cursor
        node {
          id
          name
          videoUrl
          jsonUrl
          createdAt
        }
      }
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
      totalCount
    }
  }
`;

export default function FeaturedCarousel() {
  const { loading, error, data, fetchMore } = useQuery(
    GET_FEATURED_ANIMATIONS,
    {
      variables: {
        first: 5,
      },
    }
  );

  const loadMoreFeatured = () => {
    console.log(
      "Loading more featured animations",
      data.featuredPublicAnimations.pageInfo.hasNextPage
    );
    if (data.featuredPublicAnimations.pageInfo.has.hasNextPage) {
      fetchMore({
        variables: {
          first: 5,
          after: data.featuredPublicAnimations.pageInfo.endCursor,
        },
        updateQuery: (prevResult, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prevResult;
          return {
            featuredPublicAnimations: {
              ...fetchMoreResult.featuredPublicAnimations,
              edges: [
                ...prevResult.featuredPublicAnimations.edges,
                ...fetchMoreResult.featuredPublicAnimations.edges,
              ],
            },
          };
        },
      });
    }
  };

  const featuredAnimations = data?.featuredPublicAnimations?.edges || [];

  return loading ? (
    <p>Loading...</p>
  ) : error ? (
    <p>Error: {error.message}</p>
  ) : (
    <div>
      <h1 className="text-2xl font-bold my-6">Featured Animations</h1>
      <Carousel
        id="featured-animations"
        items={featuredAnimations.map(
          ({ node: { name, videoUrl, createdAt, jsonUrl } }) => (
            <LottieCard
              name={name}
              createdAt={createdAt}
              action={
                <Form method="post" action="/api/import-featured">
                  <input type="hidden" name="name" value={name} />
                  <input type="hidden" name="jsonUrl" value={jsonUrl} />
                  <button type="submit">Add to My Lotties</button>
                </Form>
              }
            >
              <video className="h-40 w-full" autoPlay loop>
                <source src={videoUrl} type="video/mp4" />
              </video>
            </LottieCard>
          )
        )}
        loadMore={loadMoreFeatured}
      />
    </div>
  );
}
