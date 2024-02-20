/* #include "uart_soft.h"
*
* Creada por: Ing. Abiezer Hernandez O.
* Fecha de creacion: 10/04/2021
* Electronica y Circuitos
*
*/

#ifndef UART_SOFT_H
#define	UART_SOFT_H

#define BAUDIOS 9600
#define Soft_Uart_Tx LATDbits.LD0
#define Soft_Uart_Rx PORTDbits.RD1
#define Soft_Uart_Tx_Dir TRISDbits.RD0
#define Soft_Uart_Rx_Dir TRISDbits.RD1

#define cristal 48
#define DELAY_FOR (4*16/cristal)                            // Retardo extra en la escritura 14us
#define DELAY_FOR_READ (4*18/cristal)                       // Retardo extra en la lectura 10us

#define BITPERIOD ((1000000/BAUDIOS))                       // Duración de  1 bit en microsegundos
#define BITPERIOD_FOR (BITPERIOD - DELAY_FOR)               // Retardo real a la Escritura
#define BITPERIOD_FOR_READ (BITPERIOD - DELAY_FOR_READ)     // Retardo real a la lectura
#define HALFBITPERIOD (BITPERIOD/2)                         // Duración medio bit

void S_Uart_Init(void);
void S_Uart_Send_Char(char Data);
void S_Uart_Send_String(char* Text);
char S_Uart_Read(void);
void S_Uart_Read_String(char* str, unsigned char size);

#endif