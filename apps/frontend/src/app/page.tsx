import { redirect } from 'next/navigation';

export default function Home() {
  //redirect to '/blogs/' which is the real homepage for blog webstie
  redirect('/blogs');

  // return (
  //   <div>Hello World</div>
  // )
}
