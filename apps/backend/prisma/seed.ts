import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, BlogStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const BLOGS: { title: string; excerpt: string; content: string }[] = [
  {
    title: 'แนะนำ React Hooks สำหรับผู้เริ่มต้น',
    excerpt:
      'เรียนรู้การใช้งาน useState, useEffect และ useCallback อย่างถูกต้องตั้งแต่เริ่มต้น',
    content:
      'React Hooks เป็นฟีเจอร์ที่เพิ่มเข้ามาใน React 16.8 ทำให้เราสามารถใช้ state และ lifecycle ใน functional component ได้\n\nการใช้ useState ช่วยให้เราจัดการ state ได้ง่ายขึ้น โดยไม่ต้องสร้าง class component อีกต่อไป\n\nตัวอย่างเช่น const [count, setCount] = useState(0) จะสร้าง state ชื่อ count และฟังก์ชัน setCount สำหรับอัปเดตค่า',
  },
  {
    title: 'TypeScript คืออะไร และทำไมถึงควรใช้',
    excerpt:
      'ทำความรู้จัก TypeScript ภาษาที่ช่วยให้โค้ด JavaScript ของคุณปลอดภัยและดูแลรักษาได้ง่ายขึ้น',
    content:
      'TypeScript คือ superset ของ JavaScript ที่เพิ่ม static typing เข้ามา ทำให้เราสามารถตรวจจับ error ได้ตั้งแต่ตอน compile\n\nข้อดีของ TypeScript ได้แก่ การ autocomplete ที่ดีขึ้น, การ refactor ที่ปลอดภัยกว่า และโค้ดที่อ่านง่ายขึ้น\n\nการเริ่มต้นใช้งานนั้นง่ายมาก เพียงเพิ่มไฟล์ tsconfig.json และเปลี่ยนนามสกุลไฟล์จาก .js เป็น .ts',
  },
  {
    title: 'NestJS Framework สำหรับ Backend Developer',
    excerpt:
      'สำรวจ NestJS framework ที่ใช้หลักการ Dependency Injection และ Decorators ทำให้เขียน API ได้อย่างเป็นระเบียบ',
    content:
      'NestJS เป็น framework สำหรับสร้าง Node.js server-side application ที่ได้รับแรงบันดาลใจมาจาก Angular\n\nจุดเด่นของ NestJS คือการใช้ TypeScript เป็นหลัก, รองรับ Dependency Injection, และมีโครงสร้างที่ชัดเจนด้วย Module, Controller, Service\n\nเหมาะสำหรับโปรเจกต์ขนาดกลางถึงใหญ่ที่ต้องการ architecture ที่ดีและทีมพัฒนาหลายคน',
  },
  {
    title: 'Prisma ORM ทำงานอย่างไร',
    excerpt:
      'ทำความเข้าใจกับ Prisma ORM ที่ช่วยให้การทำงานกับฐานข้อมูลง่ายและปลอดภัยยิ่งขึ้นด้วย type-safe queries',
    content:
      'Prisma เป็น next-generation ORM สำหรับ Node.js และ TypeScript ที่ทำให้การทำงานกับฐานข้อมูลเป็นเรื่องง่าย\n\nหัวใจของ Prisma คือ Schema file ที่ใช้นิยามโครงสร้างฐานข้อมูล จากนั้น Prisma จะ generate TypeScript types ให้อัตโนมัติ\n\nนอกจากนี้ยังมี Prisma Studio ที่เป็น GUI สำหรับดูและแก้ไขข้อมูลในฐานข้อมูลได้อย่างสะดวก',
  },
  {
    title: 'การทำ Authentication ด้วย JWT',
    excerpt:
      'เรียนรู้วิธีการสร้างระบบ Authentication ที่ปลอดภัยด้วย JSON Web Token สำหรับ REST API',
    content:
      'JWT หรือ JSON Web Token เป็นมาตรฐานสากลสำหรับการส่งข้อมูลระหว่าง parties อย่างปลอดภัย\n\nโครงสร้างของ JWT ประกอบด้วย 3 ส่วน คือ Header, Payload และ Signature แต่ละส่วนถูก encode ด้วย Base64 และคั่นด้วยจุด\n\nข้อควรระวังคือไม่ควรเก็บข้อมูลสำคัญใน Payload เพราะสามารถ decode ดูได้ แต่ไม่สามารถแก้ไขได้หาก Signature ถูกต้อง',
  },
  {
    title: 'Next.js App Router คืออะไร',
    excerpt:
      'เจาะลึก App Router ใหม่ของ Next.js ที่เปลี่ยนวิธีการสร้างเว็บแอปพลิเคชันไปอย่างสิ้นเชิง',
    content:
      'App Router เป็นระบบ routing ใหม่ของ Next.js ที่เปิดตัวใน version 13 และกลายเป็น default ใน version 14\n\nความแตกต่างหลักจาก Pages Router คือการรองรับ React Server Components โดย default ทำให้ performance ดีขึ้นมาก\n\nการจัดโครงสร้างโฟลเดอร์ก็เปลี่ยนไป โดยใช้ไฟล์ layout.tsx, page.tsx, loading.tsx และ error.tsx แทนการ export getServerSideProps',
  },
  {
    title: 'PostgreSQL vs MySQL เลือกอะไรดี',
    excerpt:
      'เปรียบเทียบ PostgreSQL และ MySQL สองฐานข้อมูลยอดนิยมเพื่อช่วยในการตัดสินใจเลือกใช้ให้ตรงกับงาน',
    content:
      'PostgreSQL และ MySQL เป็นฐานข้อมูลเชิงสัมพันธ์ที่ได้รับความนิยมสูงสุดทั้งคู่ แต่มีจุดเด่นต่างกัน\n\nPostgreSQL โดดเด่นด้านความสามารถขั้นสูง เช่น JSON support, Full-text search และ Advanced indexing เหมาะกับงานที่ซับซ้อน\n\nMySQL มีความเร็วในการ read สูง ติดตั้งง่าย และมี ecosystem ขนาดใหญ่ เหมาะกับเว็บแอปทั่วไปที่เน้น read-heavy workload',
  },
  {
    title: 'Docker สำหรับ Developer มือใหม่',
    excerpt:
      'เริ่มต้นใช้งาน Docker เพื่อสร้าง development environment ที่สม่ำเสมอและแก้ปัญหา works on my machine',
    content:
      'Docker คือแพลตฟอร์มสำหรับสร้าง, ส่ง และรัน application ใน container ที่แยกออกจากระบบ\n\nประโยชน์หลักของ Docker คือทำให้ environment เหมือนกันทุกเครื่อง ไม่ว่าจะเป็น development, staging หรือ production\n\nการเริ่มต้นใช้งานทำได้ง่ายด้วยการสร้าง Dockerfile ที่กำหนด base image และคำสั่งสำหรับ setup application',
  },
  {
    title: 'Tailwind CSS เปลี่ยนวิธีคิดเรื่อง Styling',
    excerpt:
      'ทำความรู้จัก utility-first CSS framework ที่กำลังเป็นที่นิยมและเปลี่ยนวิธีการเขียน CSS ไปตลอดกาล',
    content:
      'Tailwind CSS เป็น utility-first CSS framework ที่ให้ class สำเร็จรูปจำนวนมากสำหรับ styling โดยตรงใน HTML\n\nแนวคิดหลักคือการใช้ class เล็กๆ หลายอันรวมกันแทนการเขียน CSS แยก ทำให้ไม่ต้องคิดชื่อ class และลดปัญหา CSS specificity\n\nข้อดีที่ชัดเจนคือ bundle size เล็กมากในตอน production เพราะ Tailwind ลบ class ที่ไม่ได้ใช้ออกอัตโนมัติ',
  },
  {
    title: 'RESTful API Design Best Practices',
    excerpt:
      'แนวทางการออกแบบ REST API ที่ดี สม่ำเสมอ และเข้าใจง่ายสำหรับผู้ใช้งาน',
    content:
      'การออกแบบ REST API ที่ดีนั้นต้องคำนึงถึงความสม่ำเสมอและความเข้าใจง่ายของผู้ใช้งาน\n\nหลักการสำคัญได้แก่ การใช้ noun ในการตั้งชื่อ endpoint, การใช้ HTTP method ให้ถูกต้อง (GET, POST, PUT, PATCH, DELETE) และการส่ง HTTP status code ที่เหมาะสม\n\nการทำ versioning ก็สำคัญมาก เช่น /api/v1/users เพื่อให้สามารถอัปเดต API โดยไม่กระทบผู้ใช้เดิม',
  },
  {
    title: 'Git Workflow ที่ทีมควรรู้',
    excerpt:
      'เรียนรู้ Git branching strategy และ workflow ที่เหมาะสมสำหรับการทำงานเป็นทีม',
    content:
      'Git Workflow ที่ดีช่วยให้ทีมทำงานร่วมกันได้อย่างราบรื่นและลดความขัดแย้งของโค้ด\n\nGitflow เป็น workflow ยอดนิยมที่แบ่งเป็น branch หลักคือ main และ develop พร้อม branch สำหรับ feature, release และ hotfix\n\nสำหรับทีมขนาดเล็กอาจใช้ GitHub Flow ที่เรียบง่ายกว่า โดยสร้าง branch จาก main, ทำงาน แล้ว merge กลับผ่าน Pull Request',
  },
  {
    title: 'State Management ใน React ควรเลือกอะไร',
    excerpt:
      'เปรียบเทียบ Context API, Zustand, Redux Toolkit และ TanStack Query เพื่อเลือกใช้ให้เหมาะกับงาน',
    content:
      'การเลือก state management ที่เหมาะสมขึ้นอยู่กับขนาดและความซับซ้อนของแอปพลิเคชัน\n\nสำหรับ server state (ข้อมูลจาก API) TanStack Query เป็นตัวเลือกที่ดีที่สุดเพราะจัดการ cache, loading, error ให้อัตโนมัติ\n\nสำหรับ client state ที่ต้องแชร์ข้าม component Zustand เป็น library ที่เบาและใช้งานง่าย ในขณะที่ Redux Toolkit เหมาะกับโปรเจกต์ขนาดใหญ่ที่ต้องการ DevTools ขั้นสูง',
  },
  {
    title: 'Cloudinary สำหรับการจัดการรูปภาพ',
    excerpt:
      'เรียนรู้การใช้ Cloudinary เพื่อจัดการ อัปโหลด และ optimize รูปภาพในเว็บแอปพลิเคชันอย่างมืออาชีพ',
    content:
      'Cloudinary เป็น cloud-based service สำหรับจัดการ media ที่ครบครัน ตั้งแต่การอัปโหลด จัดเก็บ จนถึงการ deliver\n\nจุดเด่นของ Cloudinary คือการ transform รูปภาพผ่าน URL เช่น การ resize, crop, เพิ่ม watermark หรือแปลง format โดยไม่ต้องเขียนโค้ดเพิ่ม\n\nสำหรับ Node.js มี SDK ที่ใช้งานง่าย รองรับการอัปโหลดทั้งแบบ file path และ stream เหมาะกับระบบที่ deploy บน serverless',
  },
  {
    title: 'Unit Testing ด้วย Jest และ Testing Library',
    excerpt:
      'เริ่มต้นเขียน unit test สำหรับ React application ด้วย Jest และ React Testing Library อย่างถูกวิธี',
    content:
      'การเขียน test เป็นสิ่งสำคัญที่ช่วยให้มั่นใจว่าโค้ดทำงานถูกต้องและป้องกัน regression\n\nJest เป็น test framework ที่ได้รับความนิยมสูงสุดสำหรับ JavaScript มาพร้อม test runner, assertion library และ mock functions\n\nReact Testing Library ช่วยให้เราเขียน test ในมุมมองของผู้ใช้ โดยเน้น query element ด้วย role, label หรือ text แทนการ query ด้วย CSS class',
  },
  {
    title: 'WebSocket กับ Real-time Application',
    excerpt:
      'ทำความเข้าใจ WebSocket protocol และการนำไปใช้สร้าง real-time features เช่น chat และ live notification',
    content:
      'WebSocket เป็น protocol ที่ช่วยให้ client และ server สื่อสารกันแบบ bidirectional อย่างต่อเนื่อง ต่างจาก HTTP ที่เป็น request-response\n\nการใช้งานที่พบบ่อยได้แก่ chat application, live score, collaborative editing และ real-time dashboard\n\nใน NestJS มี @nestjs/websockets package ที่รองรับทั้ง Socket.io และ native WebSocket ทำให้พัฒนา real-time feature ได้ง่ายขึ้น',
  },
  {
    title: 'การ Deploy Node.js บน Railway',
    excerpt:
      'คู่มือครบสำหรับการ deploy Node.js application บน Railway platform ตั้งแต่ตั้งค่าจนถึง production',
    content:
      'Railway เป็น platform ที่ทำให้การ deploy application เป็นเรื่องง่าย รองรับ Node.js, Python, Ruby และอื่นๆ\n\nขั้นตอนหลักคือเชื่อมต่อ GitHub repository, ตั้งค่า environment variables และ Railway จะ build และ deploy ให้อัตโนมัติ\n\nสิ่งสำคัญที่ต้องระวังคือ Railway ใช้ ephemeral filesystem หมายความว่าไฟล์ที่เขียนลง disk จะหายหลัง restart จึงควรใช้ cloud storage เช่น S3 หรือ Cloudinary สำหรับไฟล์ถาวร',
  },
  {
    title: 'Zod Schema Validation ใน TypeScript',
    excerpt:
      'เรียนรู้การใช้ Zod สำหรับ runtime validation และ type inference ที่ช่วยให้โค้ด TypeScript ปลอดภัยยิ่งขึ้น',
    content:
      'Zod เป็น TypeScript-first schema validation library ที่ช่วยให้เราตรวจสอบข้อมูลได้ทั้งตอน compile และ runtime\n\nจุดเด่นคือ Zod สามารถ infer TypeScript type จาก schema ได้อัตโนมัติด้วย z.infer ทำให้ไม่ต้องประกาศ type ซ้ำซ้อน\n\nนิยมใช้คู่กับ React Hook Form ผ่าน @hookform/resolvers เพื่อ validate form input ทั้งฝั่ง client และสามารถนำ schema เดียวกันไปใช้ฝั่ง server ได้',
  },
  {
    title: 'CSS Grid Layout ฉบับเข้าใจง่าย',
    excerpt:
      'เชี่ยวชาญ CSS Grid ตัวแสนสำคัญที่ช่วยให้การจัด layout ซับซ้อนกลายเป็นเรื่องง่าย',
    content:
      'CSS Grid เป็น layout system ที่ทรงพลังที่สุดใน CSS ออกแบบมาสำหรับ two-dimensional layout ทั้งแถวและคอลัมน์\n\nแนวคิดหลักคือการกำหนด grid container ด้วย display: grid จากนั้นกำหนดคอลัมน์ด้วย grid-template-columns และแถวด้วย grid-template-rows\n\nฟีเจอร์ที่ทรงพลังอีกอย่างคือ grid-template-areas ที่ให้เราตั้งชื่อพื้นที่ใน grid แล้วระบุให้แต่ละ element ไปอยู่ในพื้นที่นั้น',
  },
  {
    title: 'Monorepo Structure สำหรับโปรเจกต์ขนาดใหญ่',
    excerpt:
      'ทำความเข้าใจ Monorepo และวิธีการจัดโครงสร้างโปรเจกต์ที่มีหลาย package ให้อยู่ใน repository เดียว',
    content:
      'Monorepo คือ pattern การจัดการโค้ดที่เก็บหลาย project ไว้ใน repository เดียว แต่ยังคงความเป็นอิสระของแต่ละ package\n\nข้อดีคือ code sharing ทำได้ง่าย, atomic commits ข้าม package และการจัดการ dependency ที่สม่ำเสมอ\n\nเครื่องมือที่นิยมใช้ได้แก่ npm workspaces, Turborepo และ Nx แต่ละตัวมีจุดเด่นต่างกัน ควรเลือกให้เหมาะกับขนาดและความต้องการของทีม',
  },
  {
    title: 'Error Handling ใน Async JavaScript',
    excerpt:
      'เรียนรู้วิธีจัดการ error ใน asynchronous code อย่างถูกต้องและครบถ้วนด้วย try-catch และ Promise',
    content:
      'การจัดการ error ใน async code เป็นสิ่งสำคัญที่มักถูกมองข้าม แต่ส่งผลมากต่อความเสถียรของแอปพลิเคชัน\n\nสำหรับ async/await ควรใช้ try-catch ครอบเสมอ และระวังกรณีที่ Promise หลายตัวรันพร้อมกันด้วย Promise.all ซึ่งจะ fail ทั้งหมดถ้ามีตัวเดียวพัง\n\nใน production ควรมี global error handler เพื่อดักจับ unhandled rejection และส่ง log ไปยัง monitoring service เพื่อติดตามปัญหา',
  },
  {
    title: 'การทำ SEO ด้วย Next.js Metadata API',
    excerpt:
      'เรียนรู้การใช้ Metadata API ของ Next.js เพื่อทำ SEO อย่างถูกต้องและเพิ่ม visibility บน search engine',
    content:
      'Next.js App Router มี Metadata API ที่ทำให้การตั้งค่า SEO ง่ายและเป็นระบบมากขึ้น\n\nการใช้งานทำได้โดย export object ชื่อ metadata หรือฟังก์ชัน generateMetadata จาก page.tsx โดย Next.js จะ inject tag เหล่านั้นใน <head> ให้อัตโนมัติ\n\nนอกจาก title และ description แล้ว ยังรองรับ Open Graph, Twitter Cards และ JSON-LD structured data ซึ่งช่วยให้การแชร์บน social media ดูดีขึ้น',
  },
  {
    title: 'Axios vs Fetch API เลือกอะไรดีกว่ากัน',
    excerpt:
      'เปรียบเทียบ Axios และ native Fetch API อย่างละเอียดเพื่อช่วยในการเลือกใช้ให้เหมาะกับโปรเจกต์',
    content:
      'Axios และ Fetch เป็นสองตัวเลือกหลักสำหรับการทำ HTTP request ใน JavaScript แต่ละตัวมีข้อดีข้อเสียต่างกัน\n\nAxios มาพร้อม interceptor, automatic JSON parse, request/response transformation และ cancel token ทำให้ใช้งานสะดวกในโปรเจกต์ใหญ่\n\nFetch เป็น native browser API ที่ไม่ต้องติดตั้ง library เพิ่ม แต่ต้องจัดการ JSON parsing และ error handling เองมากกว่า',
  },
  {
    title: 'bcrypt กับการเก็บรหัสผ่านอย่างปลอดภัย',
    excerpt:
      'ทำความเข้าใจหลักการ hash รหัสผ่านด้วย bcrypt และสาเหตุที่ไม่ควรเก็บรหัสผ่านแบบ plain text เด็ดขาด',
    content:
      'การเก็บรหัสผ่านแบบ plain text คือความผิดพลาดร้ายแรงที่สุดในด้าน security ถ้าฐานข้อมูลรั่วไหล ผู้ใช้ทุกคนจะได้รับผลกระทบทันที\n\nbcrypt เป็น password hashing function ที่ออกแบบมาให้ช้าโดยตั้งใจ ทำให้ brute force attack ใช้เวลานานมาก โดย salt rounds ยิ่งมากยิ่งปลอดภัยแต่ใช้เวลา hash นานขึ้น\n\nจุดสำคัญคือ bcrypt ใช้ salt ที่สุ่มขึ้นใหม่ทุกครั้ง ทำให้รหัสผ่านเดียวกันได้ hash ต่างกันในแต่ละครั้ง ป้องกัน rainbow table attack ได้อย่างมีประสิทธิภาพ',
  },
  {
    title: 'TanStack Query กับ Server State Management',
    excerpt:
      'เจาะลึกการใช้ TanStack Query เพื่อจัดการ server state ใน React อย่างมืออาชีพ พร้อม caching และ synchronization',
    content:
      'TanStack Query (เดิมชื่อ React Query) เป็น library สำหรับจัดการ server state ที่ดีที่สุดในปัจจุบัน\n\nแนวคิดหลักคือการแยก server state (ข้อมูลจาก API) ออกจาก client state (UI state) ซึ่งมีลักษณะต่างกันโดยสิ้นเชิง\n\nTanStack Query จัดการ caching, background refetching, optimistic updates และ pagination ให้อัตโนมัติ ลดโค้ด boilerplate ที่ต้องเขียนเองลงได้มาก',
  },
  {
    title: 'shadcn/ui คอมโพเนนต์ไลบรารีที่ไม่ใช่ไลบรารี',
    excerpt:
      'ทำความรู้จัก shadcn/ui แนวทางใหม่ในการใช้ UI component ที่คุณเป็นเจ้าของโค้ดอย่างแท้จริง',
    content:
      'shadcn/ui เป็น component collection ที่แตกต่างจาก UI library ทั่วไป เพราะไม่ได้ install เป็น npm package แต่ copy โค้ด component มาไว้ในโปรเจกต์โดยตรง\n\nข้อดีคือคุณเป็นเจ้าของโค้ดทั้งหมด แก้ไขได้ตามต้องการโดยไม่ต้อง override style ผ่าน hack ต่างๆ\n\nสร้างบน Radix UI ซึ่งให้ accessibility ที่ดีโดย default และใช้ Tailwind CSS สำหรับ styling ทำให้เข้ากันได้ดีกับโปรเจกต์ที่ใช้ stack นี้อยู่แล้ว',
  },
];

async function main() {
  // Seed Admin
  const email = 'admin@gmail.com';
  const plainPassword = 'admin1234';
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  await prisma.admin.upsert({
    where: { email },
    update: {},
    create: { email, hashedPassword },
  });
  console.log(`✅ Admin seeded: ${email}`);

  // Seed Blogs
  // เช็คก่อนว่ามี blog อยู่แล้วไหม ถ้ามีครบแล้วข้ามไป ป้องกัน duplicate ตอนรัน seed ซ้ำ
  const existingCount = await prisma.blog.count();
  if (existingCount >= BLOGS.length) {
    console.log(`⏭️  Blogs already seeded (${existingCount} found), skipping`);
    return;
  }

  let created = 0;
  for (const [index, blog] of BLOGS.entries()) {
    // slug: แปลงจาก title ภาษาไทยเป็น index-based เพื่อให้ URL-friendly เสมอ
    const slug = `blog-post-${String(index + 1).padStart(2, '0')}`;

    // สลับสถานะระหว่าง PUBLISHED และ UNPUBLISHED (20 published, 5 unpublished)
    // เพื่อทดสอบว่า public page แสดงเฉพาะ PUBLISHED และ admin เห็นทั้งหมด
    const status = index < 20 ? BlogStatus.PUBLISHED : BlogStatus.UNPUBLISHED;

    await prisma.blog.upsert({
      where: { slug },
      update: {},
      create: {
        title: blog.title,
        slug,
        excerpt: blog.excerpt,
        content: blog.content,
        coverImageUrl: `https://picsum.photos/seed/${index + 1}/800/450`,
        status,
        viewCount: Math.floor(Math.random() * 500),
      },
    });
    created++;
  }

  console.log(
    `✅ Blogs seeded: ${created} blogs (20 published, 5 unpublished)`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
