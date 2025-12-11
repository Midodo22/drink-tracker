<!DOCTYPE html>
<html lang="en">
    <?php
        require "../logic_php/login_logic.php";
    ?>

    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="shortcut icon" href="../images/penguin.jpg">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css">
        <link rel="stylesheet" href="../css/styles.css">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=DotGothic16&display=swap" rel="stylesheet">
        <title>Login Page</title>
    </head>

    <body>
        <?php if ($message): ?>
            <div class="toast <?php echo $toastClass; ?>" role="alert">
                <div style="display: flex; align-items: center;">
                    <div><?php echo $message; ?></div>
                    <button type="button" class="btn-close" onclick="this.parentElement.parentElement.style.display='none'">×</button>
                </div>
            </div>
        <?php endif; ?>

        <div class="card">
            <div style="text-align: center; margin-bottom: 1.5rem;">
                <i class="fa fa-user-circle-o fa-3x" style="color: var(--theme_green);"></i>
                <h1 style="margin-top: 1rem;">Login to Your Account</h1>
            </div>
            
            <form action="" method="post">
                <div style="margin-bottom: 1rem;">
                    <label for="username"><i class="fa fa-user"></i> Username</label>
                    <input class="text-box" type="text" name="username" id="username" required >
                </div>

                <div style="margin-bottom: 1.5rem;">
                    <label for="password"><i class="fa fa-lock"></i> Password</label>
                    <input class="text-box" type="password" name="password" id="password" required>
                </div>

                <button type="submit" class="cta" 
                    style="background-color: var(--theme_green); color: white; font-weight: 600; cursor: pointer;">
                    Login
                </button>
            </form>

            <div style="margin-top: 1.5rem; text-align: center;">
                <p style="font-weight: 600;">
                    Don't have an account? <a href="register.php" style="color: var(--theme_green); text-decoration: none; font-weight: bold;">Create Account</a>
                </p>
            </div>
        </div>

        <script>
            <?php if ($message): ?>
                document.querySelector('.toast').classList.add('show');
                setTimeout(function() {
                    var toast = document.querySelector('.toast');
                    if (toast) toast.style.display = 'none';
                }, 3000);
            <?php endif; ?>
        </script>
    </body>

</html>
