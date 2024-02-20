/* #include "fingerprint.h"
*
* Creada por: Ing. Abiezer Hernandez O.
* Fecha de creacion: 01/07/2022
* Electronica y Circuitos
*
*/

#ifndef FINGERPRINT_H
#define	FINGERPRINT_H

#define FINGERPRINT_OK                  0x00
#define FINGERPRINT_PACKETRECIEVEERR    0x01
#define FINGERPRINT_IMAGEMESS           0x06
#define FINGERPRINT_NOTFOUND            0x09
#define FINGERPRINT_ENROLLMISMATCH      0x0A
#define FINGERPRINT_BADLOCATION         0x0B
#define FINGERPRINT_DELETEFAIL          0x10
#define FINGERPRINT_DBCLEARFAIL         0x11
#define FINGERPRINT_FLASHERR            0x18

void Fingerprint_Init(unsigned long baud);
void Fingerprint_Send_Buffer(uint8_t* buf, uint8_t size);
void Fingerprint_Read_Parameters(void);
void Fingerprint_GetImage(void);
void Fingerprint_Image2Tz(uint8_t n);
void Fingerprint_Search(void);
void Fingerprint_GetModel(void);
uint8_t Fingerprint_StoreModel(uint8_t id);
uint8_t Fingerprint_DeleteModel(uint8_t id);
uint8_t Fingerprint_GetTemplateCount(void);
uint8_t Fingerprint_EmptyDatabase(void);
uint16_t Fingerprint_Get_ID(void);

#endif