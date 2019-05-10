<?php

namespace App\Modules\Auth\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

/**
 * Description of ConfirmEmail
 *
 * @author Nitin Kumar Soni
 */
class ConfirmEmail extends Notification implements ShouldQueue{

    use Queueable;

    private $user;

    public function __construct($user) {
        $this->user = $user;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable) {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable) {
        $fullName = title_case($this->user->profile->first_name . ' ' . $this->user->profile->last_name);
        $confirmation_code = $this->user->guid . '/' . $this->user->confirmation_code;
        return (new MailMessage)
                        ->line('Welcome ' . $fullName . ',')
                        ->line('Thanks for registering with us. Lets start your journey with us.')
                        ->line('Your OTP is ' . $this->user->otp);
        //->line('Please confirm you email by click on below button.')
        //->action('Verify Email', url('auth/verify-email/' . $confirmation_code));
    }

    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toArray($notifiable) {
        return [
        ];
    }

}
