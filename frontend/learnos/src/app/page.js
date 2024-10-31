import { redirect } from 'next/navigation';


export default function Page() {
  // Redirect to "/dashboard" immediately when this page is rendered
    redirect('/pages/home');

    return {}; // No UI needed since it redirects
}
