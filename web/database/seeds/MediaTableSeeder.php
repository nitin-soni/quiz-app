<?php

use Illuminate\Database\Seeder;
use App\Modules\Media\Models\MediaSection;
use App\Modules\Media\Models\MediaExtension;

class MediaTableSeeder extends Seeder
{

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //create media sections
        $mediaSections = [
            [
                'alias' => 'album',
                'name' => 'Album Images',
            ],
            [
                'alias' => 'profile',
                'name' => 'Profile Images',
            ],
            [
                'alias' => 'profile-banner',
                'name' => 'Profile Banner Images',
            ],
            [
                'alias' => 'wall',
                'name' => 'Wall Images',
            ],
        ];
        foreach ($mediaSections as $key => $value)
        {
            $perm = MediaSection::create($value);
        }

        //create media sections
        $mediaSections = [
            [
                'name' => 'jpg',
                'type' => 'image',
            ],
            [
                'name' => 'jpeg',
                'type' => 'image',
            ],
            [
                'name' => 'png',
                'type' => 'image',
            ],
            [
                'name' => 'gif',
                'type' => 'image',
            ],
            [
                'name' => 'bmp',
                'type' => 'image',
            ],
            [
                'name' => 'svg',
                'type' => 'image',
            ],
            [
                'name' => 'mp4',
                'type' => 'video',
            ],
            [
                'name' => 'mov',
                'type' => 'video',
            ],
            [
                'name' => '3gp',
                'type' => 'video',
            ],
            [
                'name' => 'avi',
                'type' => 'video',
            ],
            [
                'name' => 'webm',
                'type' => 'video',
            ],
            [
                'name' => 'flv',
                'type' => 'video',
            ],
            [
                'name' => 'mpeg',
                'type' => 'video',
            ],
            [
                'name' => 'mpg',
                'type' => 'video',
            ],
            [
                'name' => 'pdf',
                'type' => 'document',
            ],
            [
                'name' => 'doc',
                'type' => 'document',
            ],
            [
                'name' => 'docx',
                'type' => 'document',
            ],
            [
                'name' => 'txt',
                'type' => 'document',
            ],
            [
                'name' => 'ppt',
                'type' => 'document',
            ],
            [
                'name' => 'pptx',
                'type' => 'document',
            ],
            [
                'name' => 'ppsx',
                'type' => 'document',
            ],
            [
                'name' => 'csv',
                'type' => 'document',
            ],
            [
                'name' => 'xls',
                'type' => 'document',
            ],
            [
                'name' => 'xlsx',
                'type' => 'document',
            ],
        ];
        foreach ($mediaSections as $key => $value)
        {
            $perm = MediaExtension::create($value);
        }
    }

}
