<?php

namespace App\Modules\User\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

/**
 * Description of WelcomeEmail
 *
 * @author sonin
 */
class WelcomeEmail extends Notification implements ShouldQueue {

    use Queueable;

    private $user, $password;

    public function __construct($user, $password) {
        $this->user = $user;
        $this->password = $password;
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
        $url = url('login');
        $fullName = title_case($this->user->profile->first_name . ' ' . $this->user->profile->last_name);
        return (new MailMessage)
                        ->line('Welcome ' . $fullName . ',')
                        ->line('We have created your account with us. Please use below details to login')
                        ->line('Username is ' . $this->user->email . '')
                        ->line('Password is ' . $this->password . '')
                        ->action('Login Link', $url);
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
