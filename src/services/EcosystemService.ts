import { DocumentData, DocumentReference, addDoc, collection, doc, onSnapshot, query, where } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { Ecosystem } from '../types/Ecosystem.type';

export default class EcosystemService {
    public static getEcosystems(adminId: string, callBack: (ecosystems: Ecosystem[]) => void): void {
        const q = query(collection(db, "ecos"), where("admin_id", "==", adminId));
        onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Ecosystem[];
            callBack(data);
        });
    }

    public static createEcosystem(ecos: Ecosystem, successCallback: (docRef:DocumentReference<DocumentData>) => void, errorCallback: ()=> void): void {
        const { organization_name, admin_id } = ecos;
        addDoc(collection(db, "ecos"), {
            organization_name,
            admin_id,
            responses: 0
        }).then((docRef) => {
            successCallback(docRef);
        }).catch((error) => {
            console.error("Error adding document: ", error);
            errorCallback();
        });
    }

    public static getEcosystem(ecosId: string, callBack: (ecosystem: Ecosystem) => void): void {
        onSnapshot(doc(db, "ecos", ecosId), (doc) => {
            const data = {
                id: doc.id,
                ...doc.data(),
            } as Ecosystem;
            callBack(data);
        });
    }
}