/** Item in the navigation bar.
 */
export interface NavItemType {
  title: string; // Title for this item
  route: string; // Route name (see router.ts)
  icon?: string; // Icon name
  divider?: boolean; // Show divider after item?
  children?: NavItemType[]; // Child items
}
