import {
  getDocs,
  collection,
  getDoc,
  doc,
  addDoc,
  query,
  orderBy,
  limit,
  startAt,
} from 'firebase/firestore'
import { db } from 'services/libs/firebase'

interface PastVersionBody {
  message: {
    title: {
      en: string
      th: string
      cn: string
    }
    body: {
      en: string
      th: string
      cn: string
    }
  }
  system: 'ios' | 'android'
  version: string
  updated_by: string
}

const SORTING_KEY: { [key: string]: string } = {
  updatedAt: 'updated_at',
  system: 'system',
  version: 'version',
  updatedBy: 'updated_by',
}

class AppVersionService {
  async getPastVersions(
    pageSize: number = 10,
    currentPage: number = 1,
    sorting: string = 'updated_at',
    direction: 'desc' | 'asc' = 'desc'
  ) {
    const dataRef = collection(db, 'app-version')
    const allData = await getDocs(dataRef)

    // Query the previous data of docs
    const previous = query(
      dataRef,
      orderBy(SORTING_KEY[sorting], direction),
      limit(pageSize * (currentPage === 1 ? currentPage : currentPage - 1) + 1)
    )
    const documentSnapshots = await getDocs(previous)

    // Get the last visible document
    const first =
      documentSnapshots.docs[
        currentPage === 1 ? 0 : documentSnapshots.docs.length - 1
      ]

    const sortedDataQuery = query(
      dataRef,
      orderBy(SORTING_KEY[sorting], direction),
      startAt(first),
      limit(pageSize)
    )
    const querySnapshot = await getDocs(sortedDataQuery)
    const data = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
      updated_at: new Date(
        doc.data().updated_at.seconds * 1000 +
          doc.data().updated_at.nanoseconds / 1000000
      ),
    }))
    return {
      data,
      pagination: {
        page_number: currentPage,
        page_size: pageSize,
        total: allData.docs.length,
        total_page: Math.ceil(allData.docs.length / pageSize),
      },
    }
  }

  async getPastVersion(id: string) {
    const docRef = doc(db, 'app-version', id)
    const querySnapshot = await getDoc(docRef)

    if (querySnapshot.exists()) {
      return {
        id: querySnapshot.id,
        system: querySnapshot.data().system,
        version: querySnapshot.data().version,
        updated_by: querySnapshot.data().updated_by,
        message: {
          title: {
            en: querySnapshot.data().message_title_en,
            th: querySnapshot.data().message_title_th,
            cn: querySnapshot.data().message_title_cn,
          },
          body: {
            en: querySnapshot.data().message_body_en,
            th: querySnapshot.data().message_body_th,
            cn: querySnapshot.data().message_body_cn,
          },
        },
        updated_at: new Date(
          querySnapshot.data().updated_at.seconds * 1000 +
            querySnapshot.data().updated_at.nanoseconds / 1000000
        ),
      }
    } else {
      console.log('No such document')
    }
  }

  async addPastVersion(data: PastVersionBody) {
    const res = await addDoc(collection(db, 'app-version'), {
      system: data.system,
      version: data.version,
      updated_by: data.updated_by,
      message_title_en: data.message.title.en,
      message_title_th: data.message.title.th,
      message_title_cn: data.message.title.cn,
      message_body_en: data.message.body.en,
      message_body_th: data.message.body.th,
      message_body_cn: data.message.body.cn,
      updated_at: new Date(),
    })
    return res
  }
}
export const appVersionService = new AppVersionService()
