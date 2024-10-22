export interface Message {
  id: number;
  sender: {
    id: number;
    username: string;
    email: string;
  }; // Objet utilisateur pour l'expéditeur
  receiver: {
    id: number;
    username: string;
    email: string;
  }; // Objet utilisateur pour le destinataire
  content: string; // Contenu du message
  sentAt: Date; // Date et heure d'envoi
  annonceId: number; // ID de l'annonce associée
}
