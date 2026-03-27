<?php

namespace App\Mail;

use App\Models\Appointment;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AppointmentCompletedMail extends Mailable
{
    use Queueable, SerializesModels;

    public $appointment;

    public function __construct(Appointment $appointment)
    {
        $this->appointment = $appointment;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Vaš pregled je obavljen',
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.appointment_completed',
            with: [
                'doctorName' => $this->appointment->doctor->first_name . ' ' . $this->appointment->doctor->last_name,
                'startTime' => $this->appointment->start_time->format('d.m.Y H:i'),
                'note' => $this->appointment->note,
            ]
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
