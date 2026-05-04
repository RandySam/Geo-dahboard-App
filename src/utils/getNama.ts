export const getNama = (props: any) => {
  return (
    props?.nama ||
    props?.Nama ||
    props?.Nama_Objek ||
    "Fasilitas"
  );
};