import PDFDocument from 'pdfkit'
import admin from '../config/firebaseConfig'

const jumpLine = (doc, lines) => {
    for (let index = 0; index < lines; index++) {
        doc.moveDown();
    }
}
const distanceMargin = 18;

export default class CertificateService {

    static async _writeContent(doc, donor, recipient, amount, timestamp) {
        doc
            .fillAndStroke('#e7a938')
            .lineWidth(20)
            .lineJoin('round')
            .rect(
                distanceMargin,
                distanceMargin,
                doc.page.width - distanceMargin * 2,
                doc.page.height - distanceMargin * 2,
            )
            .stroke();

        doc
            .font('Courier-Bold')
            .fontSize(32)
            .fill('#032635')
            .text('Certificate of Donation', {
                align: 'center'
            });
        jumpLine(doc, 2)

        doc
            .font('Courier')
            .fontSize(18)
            .fill('#032635')
            .text('This certificate is presented to', {
                align: 'center'
            });
        doc.moveDown();
        doc
            .font('Courier-Bold')
            .fontSize(24)
            .fill('#032635')
            .text(donor, {
                align: 'center'
            });
        jumpLine(doc, 2)
        doc
            .font('Courier')
            .fontSize(18)
            .fill('#032635')
            .text('In recognition of their donation to', {
                align: 'center'
            });
        doc.moveDown();
        doc
            .font('Courier-Bold')
            .fontSize(24)
            .fill('#032635')
            .text(recipient, {
                align: 'center'
            });
        jumpLine(doc, 2)
        doc
            .font('Courier')
            .fontSize(18)
            .fill('#032635')
            .text(`With total donation amount of ${amount} Baht`, {
                align: 'center'
            });
        jumpLine(doc, 3)
        doc
            .font('Courier-Bold')
            .fontSize(18)
            .fill('#032635')
            .text(timestamp, {
                align: 'center'
            });
    }

    static async generateCertificate(donateStatus) {
        // Parse data
        const timestamp = new Date(donateStatus.timestamp);
        const snapshot = await admin.database().ref(`users/${donateStatus.from}`).once('value');
        const userRecord = snapshot.val();
        const fullName = `${userRecord.firstname} ${userRecord.lastname}`

        // Initiate bucket
        const bucket = admin.storage().bucket()
        const file = bucket.file(`${donateStatus.txId}.pdf`);

        const bucketFileStream = file.createWriteStream();

        const doc = new PDFDocument({
            layout: 'landscape',
            size: 'A4',
        });
        // Pipe its output to the bucket
        doc.pipe(bucketFileStream);
        await this._writeContent(doc, fullName, donateStatus.to, donateStatus.amount, timestamp.toDateString())
        doc.end();
        console.log("Finish PDF File Stream")
    }

}







