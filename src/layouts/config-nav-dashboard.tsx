import { Label } from 'src/components/label';
import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor width="100%" height="100%" src={`/assets/icons/navbar/${name}.svg`} />
);

export const navData = [
  {
    title: 'Dashboard',
    path: '/dashboard',
    icon: icon('ic-analytics'),
  },
  {
    title: 'Dealer',
    path: '/dashboard/dealer',
    icon: icon('ic-user'),
  },
  {
    title: 'Bill',
    path: '/dashboard/bill',
    icon: icon('ic-user'),
  },
  // {
  //   title: 'Product',
  //   path: '/dashboard/products',
  //   icon: icon('ic-cart'),
  //   info: (
  //     <Label color="error" variant="inverted">
  //       +3
  //     </Label>
  //   ),
  // },
];
