[Windows.UI.Notifications.ToastNotificationManager, Windows.UI.Notifications, ContentType = WindowsRuntime] | Out-Null
[Windows.Data.Xml.Dom.XmlDocument, Windows.Data.Xml.Dom, ContentType = WindowsRuntime] | Out-Null

$template = @"
<toast duration="long">
    <visual>
        <binding template="ToastGeneric">
            <text>提醒事项</text>
            <text>打球</text>
        </binding>
    </visual>
    <audio src="ms-winsoundevent:Notification.Reminder"/>
</toast>
"@

$xml = New-Object Windows.Data.Xml.Dom.XmlDocument
$xml.LoadXml($template)

$appId = '{1AC14E77-02E7-4E5D-B744-2EB1AE5198B7}\WindowsPowerShell\v1.0\powershell.exe'
$toast = [Windows.UI.Notifications.ToastNotificationManager]::CreateToastNotifier($appId)
$notification = [Windows.UI.Notifications.ToastNotification]::new($xml)
$toast.Show($notification)
