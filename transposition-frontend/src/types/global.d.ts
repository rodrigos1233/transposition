// This file provides global type declarations
import React from 'react';

// Re-export JSX namespace for components that reference it directly
declare global {
  namespace JSX {
    interface Element extends React.ReactElement<any, any> {}
    interface IntrinsicElements extends React.JSX.IntrinsicElements {}
  }
}
