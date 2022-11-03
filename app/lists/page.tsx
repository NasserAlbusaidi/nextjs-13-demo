import Head from "next/head";
import { PrismaClient } from "@prisma/client";
import { checkCustomRoutes } from "next/dist/lib/load-custom-routes";

const prisma = new PrismaClient();
async function getLists() {
  let surahinfo: { sura: number; page: number }[] = [];

  const surahv2 = await prisma.surah_back.findMany();
  surahv2.map(async (surah) => {
    surahinfo.push({
      sura: surah.number - 1,
      page: surah.first_page_num - 1,
    });
  });
  surahinfo.shift();

  const lists = await prisma.quran_word.findMany({
    where: {
    //    AND: surahinfo,
    sura: 19,
    page: 319,
    },
  });

  return lists
}

async function checkLine() {
  const lists = await getLists();
  const maxLine = Math.max.apply(Math,lists.map(function (o) {return o.line;}));

  console.log(maxLine);
  lists.map(async (list) => {
    if (list.EndOfSurah == true && list.line !== maxLine) {
      const update = await prisma.quran_word.update({
        where: {
          id: list.id,
        },
        data: {
          EndOfSurah: false,
        },
      });
    }
    else if (list.EndOfSurah == false && list.line == maxLine) {
        const update = await prisma.quran_word.update({
            where: {
              id: list.id,
            },
            data: {
              EndOfSurah: true,
            },
          });
    }
  });
}

export default async function Lists() {
  const lists = await getLists();
  await checkLine();

  return (
    <div>
      <Head>
        <title>Lists</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Lists</h1>
      </main>
      <body>
        <table className="table-auto w-screen ">
          <thead>
            <tr>
              <th className="border px-4 py-2 font-bold text-red-900">Page</th>
              <th className=" borderpx-4 py-2 font-bold text-red-900">Text</th>
              <th className="border px-4 py-2 font-bold text-red-900">
                {" "}
                Surah Name
              </th>
              <th className="border px-4 py-2 font-bold text-red-900">Line</th>
              <th className="border px-4 py-2 font-bold text-red-900">
                Surah Number
              </th>
              <th className=" border px-4 py-2 font-bold text-red-900">
                End of Surah
              </th>
            </tr>
          </thead>
          <tbody>
            {lists.map((list) => (
              <tr key={list.index}>
                <td className="border px-4 py-2">{list.page}</td>
                <td className="border px-4 py-2">{list.text}</td>
                <td className="border px-4 py-2">{list.SurahName}</td>
                <td className="border px-4 py-2">{list.line}</td>
                <td className="border px-4 py-2">{list.sura}</td>
                <td className="border px-4 py-2">{list.EndOfSurah ? 1 : 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </body>
    </div>
  );
}
