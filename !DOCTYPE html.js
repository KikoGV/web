<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reserva de Citas - Barbería</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            text-align: center;
            padding: 20px;
        }
        h1 {
            color: #333;
        }
        #calendar {
            margin-bottom: 20px;
        }
        .day {
            display: inline-block;
            padding: 10px;
            margin: 5px;
            width: 100px;
            height: 100px;
            text-align: center;
            background-color: #f0f0f0;
            border: 1px solid #ccc;
            cursor: pointer;
            position: relative;
        }
        .day.selected {
            background-color: #d3e5f7;
        }
        .day .reservation {
            font-size: 12px;
            color: #333;
            margin-top: 5px;
            background-color: #ffcccc;
            padding: 2px;
            border-radius: 5px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .disabled {
            background-color: #e0e0e0;
            cursor: not-allowed;
        }
        .occupied {
            background-color: #ffcccc;
            cursor: not-allowed;
        }
        .available {
            background-color: #ccffcc;
            cursor: pointer;
        }
        .hours {
            margin-top: 20px;
        }
        .hour {
            display: inline-block;
            padding: 10px;
            margin: 5px;
            background-color: #ccffcc;
            cursor: pointer;
            border: 1px solid #ccc;
        }
        .hour.occupied {
            background-color: #ffcccc;
            cursor: not-allowed;
        }
        .hour.selected {
            background-color: #4CAF50;
            color: white;
        }
        #name-section {
            margin-top: 20px;
        }
    </style>
</head>
<body>

    <h1>Reserva tu cita en la Barbería</h1>

    <div id="calendar">
        <h2>Selecciona un día</h2>
        <div class="day" id="day-1">Viernes</div>
        <div class="day" id="day-2">Sábado</div>
        <div class="day" id="day-3">Domingo</div>
    </div>

    <div class="hours" id="hours-section" style="display:none;">
        <h2>Selecciona una hora</h2>
        <div id="hours"></div>
    </div>

    <div id="name-section" style="display:none;">
        <h2>Introduce tu nombre para confirmar la cita</h2>
        <input type="text" id="name" placeholder="Tu nombre" />
        <button onclick="requestReservation()">Solicitar reserva</button>
    </div>

    <div id="selected-slot" style="margin-top: 20px;"></div>

    <script>
        // Horas disponibles según día
        const availableHours = {
            '1': ['16:00', '17:00', '18:00', '19:00', '20:00'],  // Viernes de 4pm a 8pm
            '2': ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '16:00', '17:00', '18:00', '19:00', '20:00'],  // Sábado de 8am a 1pm y de 4pm a 8pm
            '3': ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '16:00', '17:00', '18:00', '19:00', '20:00']   // Domingo de 8am a 1pm y de 4pm a 8pm
        };

        // Simulamos horas ocupadas
        let occupiedHours = {
            '1': [],
            '2': [],
            '3': []
        };

        // Selección de día
        const days = document.querySelectorAll('.day');
        let selectedDay = null;
        let selectedHour = null;

        days.forEach(day => {
            day.addEventListener('click', () => {
                // Limpiamos la selección previa
                days.forEach(d => d.classList.remove('selected'));
                day.classList.add('selected');
                selectedDay = day.id.split('-')[1];
                loadAvailableHours(selectedDay);
            });
        });

        // Función para cargar las horas disponibles del día seleccionado
        function loadAvailableHours(day) {
            const hoursDiv = document.getElementById('hours');
            hoursDiv.innerHTML = '';  // Limpiamos las horas anteriores
            document.getElementById('hours-section').style.display = 'block';

            // Cargar horas disponibles para el día seleccionado
            availableHours[day].forEach(hour => {
                const hourDiv = document.createElement('div');
                hourDiv.classList.add('hour');
                hourDiv.innerText = hour;

                // Verificamos si la hora está ocupada
                if (occupiedHours[day] && occupiedHours[day].some(h => h.hour === hour)) {
                    hourDiv.classList.add('occupied');
                    const occupiedInfo = occupiedHours[day].find(h => h.hour === hour);
                    hourDiv.innerText = `${hour} (Ocupado por ${occupiedInfo.name})`;
                } else {
                    hourDiv.classList.add('available');
                    hourDiv.addEventListener('click', () => selectHour(hourDiv, day, hour));
                }

                hoursDiv.appendChild(hourDiv);
            });
        }

        // Función para seleccionar una hora
        function selectHour(element, day, hour) {
            // Limpiamos selección previa
            const allHours = document.querySelectorAll('.hour');
            allHours.forEach(h => h.classList.remove('selected'));

            // Seleccionamos la hora
            element.classList.add('selected');
            selectedHour = hour;
            document.getElementById('name-section').style.display = 'block';
            document.getElementById('selected-slot').innerText = `Has seleccionado: Día ${day == 1 ? 'Viernes' : day == 2 ? 'Sábado' : 'Domingo'} a las ${hour}`;
        }

        // Función para solicitar la reserva
        function requestReservation() {
            const name = document.getElementById('name').value;
            if (name === '') {
                alert('Por favor, introduce tu nombre.');
                return;
            }

            // Guardamos la reserva
            occupiedHours[selectedDay].push({ hour: selectedHour, name: name });

            // Mostrar la reserva en el cuadro del día
            const selectedDayDiv = document.getElementById(`day-${selectedDay}`);

            // Si ya hay reservas, simplemente agregamos otra sin sobrescribir las anteriores
            const reservationDiv = document.createElement('div');
            reservationDiv.classList.add('reservation');
            reservationDiv.innerText = `${selectedHour}: ${name}`;
            selectedDayDiv.appendChild(reservationDiv);

            // Actualizamos el mensaje
            document.getElementById('selected-slot').innerText = `Has reservado el ${selectedDay == 1 ? 'Viernes' : selectedDay == 2 ? 'Sábado' : 'Domingo'} a las ${selectedHour} a nombre de ${name}.`;

            // Recargamos las horas para mostrar la nueva ocupación
            loadAvailableHours(selectedDay);

            // Ocultamos el input de nombre
            document.getElementById('name-section').style.display = 'none';
        }
    </script>

</body>
</html>
