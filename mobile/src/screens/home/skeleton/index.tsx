import React from "react";
import SkeletonContent from "react-native-skeleton-content";

export const FolderListSkeleton = ({ isLoading, children }: any) => {
  // Create the layour for the folder list
  const folderLayout = (
    <SkeletonContent
      containerStyle={{
        flex: 1,
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 10,
        marginRight: 10,
      }}
      isLoading={isLoading}
      layout={[
        {
          width: "100%",
          height: 100,
          marginBottom: 10,
        },
        {
          width: "100%",
          height: 100,
          marginBottom: 10,
        },
        {
          width: "100%",
          height: 100,
          marginBottom: 10,
        },
      ]}>
      {children}
    </SkeletonContent>
  );

  return folderLayout;
};
